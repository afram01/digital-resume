# Makefile for resume project

.PHONY: all run clean

all: run

run:
	@echo "Starting server..."
	@g++ -std=c++17 server.cpp -o server -lpthread
	@./server

clean:
	@rm -f server
	@echo "Cleanup complete"
