# DSA Exam Template Makefile
# Usage: make, make run, make test, make clean

CXX      = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -Wpedantic -O2
TARGET   = dsa_app
SRC      = main.cpp
HDR      = config.h

all: $(TARGET)

$(TARGET): $(SRC) $(HDR)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC)
	@echo "Build OK. Run: ./$(TARGET)"

run: $(TARGET)
	./$(TARGET)

test: $(TARGET)
	./$(TARGET) < test_input.txt

debug: CXXFLAGS += -g -DDEBUG
debug: $(TARGET)

clean:
	rm -f $(TARGET)

cleanall: clean
	rm -f *.csv *.txt

rebuild: clean all

.PHONY: all run test debug clean cleanall rebuild
