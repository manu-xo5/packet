import AppKit
import Foundation

// ============================================================================
// Custom Dialog - NSPanel-based dialog with text input
// ============================================================================

/// Result from the custom dialog
public enum DialogResult {
    case saved(name: String)
    case cancelled
}

/// Custom dialog window with a text field and Save/Cancel buttons
public class CustomDialog: NSObject, NSWindowDelegate {

    private var panel: NSPanel!
    private var nameField: NSTextField!
    private var completion: ((DialogResult) -> Void)?
    private var wasSaved = false

    private let dialogTitle: String
    private let nameLabel: String
    private let defaultName: String

    public init(title: String, nameLabel: String, defaultName: String) {
        self.dialogTitle = title
        self.nameLabel = nameLabel
        self.defaultName = defaultName
        super.init()
    }

    /// Show the dialog and call completion handler when closed
    public func show(completion: @escaping (DialogResult) -> Void) {
        self.completion = completion
        self.wasSaved = false

        // Create the panel
        panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 400, height: 150),
            styleMask: [.titled, .closable],
            backing: .buffered,
            defer: false
        )

        panel.title = dialogTitle
        panel.center()
        panel.level = .floating
        panel.delegate = self

        // Get content view
        guard let contentView = panel.contentView else { return }

        // Create label
        let label = NSTextField(labelWithString: nameLabel)
        label.frame = NSRect(x: 20, y: 100, width: 100, height: 20)
        label.alignment = .right
        contentView.addSubview(label)

        // Create text field
        nameField = NSTextField(frame: NSRect(x: 130, y: 98, width: 250, height: 24))
        nameField.stringValue = defaultName
        nameField.placeholderString = "Enter name..."
        contentView.addSubview(nameField)

        // Create Cancel button
        let cancelButton = NSButton(frame: NSRect(x: 200, y: 20, width: 90, height: 32))
        cancelButton.title = "Cancel"
        cancelButton.bezelStyle = .rounded
        cancelButton.target = self
        cancelButton.action = #selector(cancelClicked)
        cancelButton.keyEquivalent = "\u{1b}" // Escape key
        contentView.addSubview(cancelButton)

        // Create Save button
        let saveButton = NSButton(frame: NSRect(x: 300, y: 20, width: 80, height: 32))
        saveButton.title = "Save"
        saveButton.bezelStyle = .rounded
        saveButton.target = self
        saveButton.action = #selector(saveClicked)
        saveButton.keyEquivalent = "\r" // Enter/Return key
        contentView.addSubview(saveButton)

        // Focus on text field
        panel.makeFirstResponder(nameField)

        // Show the panel
        panel.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    @objc private func saveClicked() {
        wasSaved = true
        panel.close()
    }

    @objc private func cancelClicked() {
        wasSaved = false
        panel.close()
    }

    // MARK: - NSWindowDelegate

    public func windowWillClose(_ notification: Notification) {
        let name = nameField?.stringValue ?? ""

        if wasSaved && !name.isEmpty {
            completion?(.saved(name: name))
        } else {
            completion?(.cancelled)
        }

        // Clean up
        completion = nil
        panel = nil
        nameField = nil
    }
}
