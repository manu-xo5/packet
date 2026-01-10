#pragma once

// ============================================================================
// Native Module C Bridge
// ============================================================================
// This header defines the C interface between NAPI (C++) and Swift.
// The implementation is in bridge.m which calls Swift via @objc interop.
// ============================================================================

#ifdef __cplusplus
extern "C" {
#endif

// ----------------------------------------------------------------------------
// Callback Types
// ----------------------------------------------------------------------------

/// Callback for async operations
/// @param error Error message (NULL if success)
/// @param result JSON result string (NULL if error)
typedef void (*NativeCallback)(const char* error, const char* result);

// ----------------------------------------------------------------------------
// Event Loop
// ----------------------------------------------------------------------------

/// Poll and process pending macOS events
/// Call repeatedly from JavaScript when testing without Electron
void native_poll_events(void);

// ----------------------------------------------------------------------------
// Dialogs
// ----------------------------------------------------------------------------

/// Show a custom dialog with text input
/// @param title Dialog window title
/// @param name_label Label for the text field
/// @param default_name Default value in text field
/// @param callback Called with result when dialog closes
void native_show_custom_dialog(
    const char* title,
    const char* name_label,
    const char* default_name,
    NativeCallback callback
);

// ----------------------------------------------------------------------------
// Future Native Features (add declarations here)
// ----------------------------------------------------------------------------

// void native_show_file_picker(const char* title, NativeCallback callback);
// void native_show_notification(const char* title, const char* body);
// const char* native_get_system_info(void);

#ifdef __cplusplus
}
#endif
