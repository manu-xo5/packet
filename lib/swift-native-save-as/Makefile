# ============================================================================
# Native Module Build System
# ============================================================================
# This Makefile builds the Swift library and NAPI addon.
#
# Usage:
#   make           - Build everything
#   make swift     - Build Swift library only
#   make addon     - Build NAPI addon only
#   make clean     - Clean all build artifacts
#   make rebuild   - Clean and rebuild everything
# ============================================================================

.PHONY: all swift addon clean rebuild

# Configuration
SWIFT_MODULE = NativeModule
SWIFT_SOURCES = $(wildcard Sources/NativeModule/*.swift)
SWIFT_OUTPUT = lib$(SWIFT_MODULE).dylib
SWIFT_HEADER = $(SWIFT_MODULE)-Swift.h

# Build directories
BUILD_DIR = build
SWIFT_BUILD_DIR = $(BUILD_DIR)/swift

# Default target
all: swift addon

# ============================================================================
# Swift Library
# ============================================================================

swift: $(BUILD_DIR)/$(SWIFT_OUTPUT)

$(BUILD_DIR)/$(SWIFT_OUTPUT): $(SWIFT_SOURCES) | $(BUILD_DIR)
	@echo "Building Swift library..."
	swiftc \
		-module-name $(SWIFT_MODULE) \
		-emit-library \
		-emit-module \
		-emit-objc-header \
		-emit-objc-header-path $(BUILD_DIR)/$(SWIFT_HEADER) \
		-o $(BUILD_DIR)/$(SWIFT_OUTPUT) \
		-Xlinker -install_name \
		-Xlinker @rpath/$(SWIFT_OUTPUT) \
		$(SWIFT_SOURCES)
	@echo "Swift library built: $(BUILD_DIR)/$(SWIFT_OUTPUT)"

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

# ============================================================================
# NAPI Addon
# ============================================================================

addon: swift
	@echo "Building NAPI addon..."
	node-gyp rebuild
	@echo "NAPI addon built: $(BUILD_DIR)/Release/save-as.node"

# ============================================================================
# Clean
# ============================================================================

clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(BUILD_DIR)
	node-gyp clean 2>/dev/null || true
	@echo "Clean complete"

rebuild: clean all

# ============================================================================
# Help
# ============================================================================

help:
	@echo "Native Module Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all      - Build Swift library and NAPI addon (default)"
	@echo "  swift    - Build Swift library only"
	@echo "  addon    - Build NAPI addon (requires Swift library)"
	@echo "  clean    - Remove all build artifacts"
	@echo "  rebuild  - Clean and rebuild everything"
	@echo "  help     - Show this help message"
