// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "NativeModule",
    platforms: [
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "NativeModule",
            type: .dynamic,
            targets: ["NativeModule"]
        )
    ],
    targets: [
        .target(
            name: "NativeModule",
            dependencies: [],
            path: "Sources/NativeModule",
            linkerSettings: [
                .linkedFramework("AppKit")
            ]
        )
    ]
)
