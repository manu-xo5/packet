#include "bridge.h"
#import <AppKit/AppKit.h>
#include <string.h>

const char* showSaveDialog(void) {
    __block char* resultPath = NULL;

    // A block to handle the panel logic
    void (^showBlock)(void) = ^{
        NSSavePanel *panel = [NSSavePanel savePanel];
        [panel setTitle:@"Save As"];
        [panel setCanCreateDirectories:YES];
        
        [NSApp setActivationPolicy:NSApplicationActivationPolicyRegular];
        [NSApp activateIgnoringOtherApps:YES];
        
        NSInteger result = [panel runModal];
        
        if (result == NSModalResponseOK) {
            NSString *path = [[panel URL] path];
            resultPath = strdup([path UTF8String]);
        }
    };

    if ([NSThread isMainThread]) {
        showBlock();
    } else {
        dispatch_sync(dispatch_get_main_queue(), showBlock);
    }

    return resultPath;
}
