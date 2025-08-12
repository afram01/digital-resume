CC = g++
CFLAGS = -std=c++11 -Wall

all: server

server: server.cpp
	$(CC) $(CFLAGS) server.cpp -o server

clean:
	rm -f server
