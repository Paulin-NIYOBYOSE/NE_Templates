# =============================================================================
# DSA PRACTICAL EXAM TEMPLATE - MAKEFILE
# =============================================================================
#
# Usage:
#   make          - Build the application
#   make run      - Build and run
#   make clean    - Remove compiled files
#   make debug    - Build with debug symbols
#
# =============================================================================

# Compiler settings
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -pedantic

# Debug flags
DEBUG_FLAGS = -g -DDEBUG

# Output binary name
TARGET = dsa_app

# Source files
SOURCES = main.cpp

# Header files
HEADERS = config.h

# Default target
all: $(TARGET)

# Build the application
$(TARGET): $(SOURCES) $(HEADERS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)
	@echo "Build successful! Run with: ./$(TARGET)"

# Build with debug symbols
debug: CXXFLAGS += $(DEBUG_FLAGS)
debug: $(TARGET)
	@echo "Debug build complete."

# Run the application
run: $(TARGET)
	./$(TARGET)

# Clean compiled files
clean:
	rm -f $(TARGET)
	@echo "Cleaned."

# Clean data files too
cleanall: clean
	rm -f *.csv *.txt
	@echo "All data files removed."

# Rebuild
rebuild: clean all

# Help
help:
	@echo "Available targets:"
	@echo "  make          - Build the application"
	@echo "  make run      - Build and run"
	@echo "  make debug    - Build with debug symbols"
	@echo "  make clean    - Remove compiled files"
	@echo "  make cleanall - Remove compiled and data files"
	@echo "  make rebuild  - Clean and rebuild"
	@echo "  make help     - Show this help"

.PHONY: all debug run clean cleanall rebuild help
