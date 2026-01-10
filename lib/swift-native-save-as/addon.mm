// ============================================================================
// NAPI Addon - Thin wrapper exposing native functions to JavaScript
// ============================================================================
// This is the only C++ file needed. It:
// 1. Exports functions to JavaScript via NAPI
// 2. Manages ThreadSafeFunction for async callbacks
// 3. Calls the C bridge which forwards to Swift
// ============================================================================

#include <napi.h>
#include "bridge.h"
#include <string>

// ============================================================================
// Callback Management
// ============================================================================

// Store ThreadSafeFunction for async callbacks
static Napi::ThreadSafeFunction dialogTsfn;

// C callback that bridges to NAPI
static void dialogCallbackBridge(const char* error, const char* result) {
    // Copy strings since they may be deallocated after this function returns
    std::string errorStr = error ? error : "";
    std::string resultStr = result ? result : "";

    dialogTsfn.BlockingCall([errorStr, resultStr](Napi::Env env, Napi::Function fn) {
        if (!errorStr.empty()) {
            // Error case
            fn.Call({
                Napi::String::New(env, errorStr),
                env.Null()
            });
        } else {
            // Success case - return JSON string (JS will parse it)
            fn.Call({
                env.Null(),
                Napi::String::New(env, resultStr)
            });
        }
    });

    dialogTsfn.Release();
}

// ============================================================================
// NAPI Exports
// ============================================================================

/// Poll macOS events - call from JavaScript event loop
Napi::Value jsPollEvents(const Napi::CallbackInfo& info) {
    native_poll_events();
    return info.Env().Undefined();
}

/// Show custom dialog with text input
/// Arguments: options object, callback function
Napi::Value jsShowCustomDialog(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Validate arguments
    if (info.Length() < 2) {
        Napi::TypeError::New(env, "Expected 2 arguments: options object and callback")
            .ThrowAsJavaScriptException();
        return env.Undefined();
    }

    if (!info[0].IsObject()) {
        Napi::TypeError::New(env, "First argument must be an options object")
            .ThrowAsJavaScriptException();
        return env.Undefined();
    }

    if (!info[1].IsFunction()) {
        Napi::TypeError::New(env, "Second argument must be a callback function")
            .ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // Parse options
    Napi::Object options = info[0].As<Napi::Object>();

    std::string title = "Dialog";
    std::string nameLabel = "Name:";
    std::string defaultName = "";

    if (options.Has("title") && options.Get("title").IsString()) {
        title = options.Get("title").As<Napi::String>().Utf8Value();
    }

    if (options.Has("nameLabel") && options.Get("nameLabel").IsString()) {
        nameLabel = options.Get("nameLabel").As<Napi::String>().Utf8Value();
    }

    if (options.Has("defaultName") && options.Get("defaultName").IsString()) {
        defaultName = options.Get("defaultName").As<Napi::String>().Utf8Value();
    }

    // Create ThreadSafeFunction for callback
    Napi::Function callback = info[1].As<Napi::Function>();
    dialogTsfn = Napi::ThreadSafeFunction::New(
        env,
        callback,
        "CustomDialogCallback",
        0,   // Unlimited queue
        1    // Initial thread count
    );

    // Call Swift via C bridge
    native_show_custom_dialog(
        title.c_str(),
        nameLabel.c_str(),
        defaultName.c_str(),
        dialogCallbackBridge
    );

    return env.Undefined();
}

// ============================================================================
// Module Initialization
// ============================================================================

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // Event loop
    exports.Set("pollEvents", Napi::Function::New(env, jsPollEvents));

    // Dialogs
    exports.Set("showCustomDialog", Napi::Function::New(env, jsShowCustomDialog));

    // Future exports go here:
    // exports.Set("showFilePicker", Napi::Function::New(env, jsShowFilePicker));
    // exports.Set("showNotification", Napi::Function::New(env, jsShowNotification));

    return exports;
}

NODE_API_MODULE(native_module, Init)
