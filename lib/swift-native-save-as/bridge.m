#import "bridge.h"
#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>

// Import Swift module - this header is auto-generated when building Swift
// The module name must match the Swift module name
#if __has_include("NativeModule-Swift.h")
    #import "NativeModule-Swift.h"
#else
    // Forward declarations for when Swift header isn't available yet
    @interface NativeBridge : NSObject
    + (void)pollEvents;
    + (void)showCustomDialogWithTitle:(NSString *)title
                            nameLabel:(NSString *)nameLabel
                          defaultName:(NSString *)defaultName
                             callback:(void (*)(const char *, const char *))callback;
    @end
#endif

// ============================================================================
// C Bridge Implementation
// ============================================================================
// These functions are called from NAPI (C++) and forward to Swift via @objc
// ============================================================================

void native_poll_events(void) {
    [NativeBridge pollEvents];
}

void native_show_custom_dialog(
    const char* title,
    const char* name_label,
    const char* default_name,
    NativeCallback callback
) {
    NSString *titleStr = title ? [NSString stringWithUTF8String:title] : @"Dialog";
    NSString *labelStr = name_label ? [NSString stringWithUTF8String:name_label] : @"Name:";
    NSString *defaultStr = default_name ? [NSString stringWithUTF8String:default_name] : @"";

    [NativeBridge showCustomDialogWithTitle:titleStr
                                  nameLabel:labelStr
                                defaultName:defaultStr
                                   callback:callback];
}
