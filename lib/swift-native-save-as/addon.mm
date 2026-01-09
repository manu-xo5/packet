#include "bridge.h"
#import <AppKit/AppKit.h>
#include <napi.h>

void pollEvents(void) {
  NSApplication *app = [NSApplication sharedApplication];
  NSEvent *event;

  while ((event =
              [app nextEventMatchingMask:NSEventMaskAny
                               untilDate:[NSDate dateWithTimeIntervalSinceNow:0]
                                  inMode:NSDefaultRunLoopMode
                                 dequeue:YES])) {
    [app sendEvent:event];
  }
}

Napi::Value jsPollEvents(const Napi::CallbackInfo &info) {
  BOOL isMainThread = [NSThread isMainThread];

  if (isMainThread) {
    pollEvents();
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      pollEvents();
    });
  }
  return info.Env().Undefined();
}

Napi::Value jsSaveAs(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  char *path = (char *)showSaveDialog();

  if (path == NULL) {
    return env.Null();
  }

  Napi::String result = Napi::String::New(env, path);
  free(path); // Free the memory allocated by strdup
  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("pollEvents", Napi::Function::New(env, jsPollEvents));
  exports.Set("showSaveDialog", Napi::Function::New(env, jsSaveAs));
  return exports;
}

NODE_API_MODULE(native_window, Init)