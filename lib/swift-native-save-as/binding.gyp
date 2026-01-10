{
  "targets": [{
    "target_name": "save-as",
    "sources": [
      "addon.mm",
      "bridge.m"
    ],
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")",
      "swift-build"
    ],
    "dependencies": [
      "<!@(node -p \"require('node-addon-api').gyp\")"
    ],
    "defines": ["NAPI_CPP_EXCEPTIONS"],
    "libraries": [
      "-framework AppKit",
      "-framework Foundation",
      "-L<(module_root_dir)/swift-build",
      "-lNativeModule"
    ],
    "xcode_settings": {
      "CLANG_ENABLE_MODULES": "YES",
      "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
      "CLANG_CXX_LIBRARY": "libc++",
      "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
      "MACOSX_DEPLOYMENT_TARGET": "11.0",
      "OTHER_LDFLAGS": [
        "-Wl,-rpath,@loader_path/../../swift-build"
      ]
    }
  }]
}
