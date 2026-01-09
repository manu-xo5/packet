{
  "targets": [{
    "target_name": "save-as",
    "sources": [
      "addon.mm",
      "save-as.mm"
    ],
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
    "dependencies": [
      "<!@(node -p \"require('node-addon-api').gyp\")"
    ],
    "defines": ["NAPI_CPP_EXCEPTIONS"],
    "libraries": [
      "-framework AppKit"
    ],
    "xcode_settings": {
      "CLANG_ENABLE_MODULES": "YES",
      "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
      "CLANG_CXX_LIBRARY": "libc++",
      "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
      "MACOSX_DEPLOYMENT_TARGET": "11.0"
    }
  }]
}
