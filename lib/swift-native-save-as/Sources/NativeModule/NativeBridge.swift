import AppKit
import Foundation

// ============================================================================
// Native Bridge - Entry points exposed to C/Objective-C
// ============================================================================
// This class provides @objc accessible methods that can be called from
// the Objective-C bridge layer, which in turn is called from NAPI.
// ============================================================================

/// Callback type for async operations
/// Parameters: (error: String?, result: String?)
public typealias NativeCallback = @convention(c) (UnsafePointer<CChar>?, UnsafePointer<CChar>?) -> Void

/// Stored callback for the current dialog operation
/// We need to store this because the callback outlives the function call
private var currentCallback: NativeCallback?

@objc public class NativeBridge: NSObject {

    // MARK: - Event Loop

    /// Poll and process pending macOS events
    /// Call this repeatedly from JavaScript when testing without Electron
    @objc public static func pollEvents() {
        let app = NSApplication.shared

        while let event = app.nextEvent(
            matching: .any,
            until: nil,
            inMode: .default,
            dequeue: true
        ) {
            app.sendEvent(event)
        }
    }

    // MARK: - Custom Dialog

    /// Show a custom dialog with a text field
    /// - Parameters:
    ///   - title: Dialog window title
    ///   - nameLabel: Label for the text field
    ///   - defaultName: Default value in text field
    ///   - callback: C function pointer called with result
    @objc public static func showCustomDialog(
        title: String,
        nameLabel: String,
        defaultName: String,
        callback: @escaping NativeCallback
    ) {
        // Store callback for later use
        currentCallback = callback

        // Ensure we're on the main thread for UI
        if Thread.isMainThread {
            showDialogOnMainThread(title: title, nameLabel: nameLabel, defaultName: defaultName)
        } else {
            DispatchQueue.main.async {
                showDialogOnMainThread(title: title, nameLabel: nameLabel, defaultName: defaultName)
            }
        }
    }

    private static func showDialogOnMainThread(title: String, nameLabel: String, defaultName: String) {
        // Ensure NSApplication is initialized
        _ = NSApplication.shared
        NSApp.setActivationPolicy(.regular)

        // Create and show the dialog
        let dialog = CustomDialog(
            title: title,
            nameLabel: nameLabel,
            defaultName: defaultName
        )

        dialog.show { result in
            guard let callback = currentCallback else { return }

            switch result {
            case .saved(let name):
                // Escape special characters in the name for JSON
                let escapedName = name
                    .replacingOccurrences(of: "\\", with: "\\\\")
                    .replacingOccurrences(of: "\"", with: "\\\"")
                    .replacingOccurrences(of: "\n", with: "\\n")
                    .replacingOccurrences(of: "\r", with: "\\r")
                    .replacingOccurrences(of: "\t", with: "\\t")

                let json = "{\"cancelled\":false,\"name\":\"\(escapedName)\"}"
                json.withCString { ptr in
                    callback(nil, ptr)
                }

            case .cancelled:
                let json = "{\"cancelled\":true}"
                json.withCString { ptr in
                    callback(nil, ptr)
                }
            }

            currentCallback = nil
        }
    }
}
