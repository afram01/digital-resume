#include <iostream>
#include <string>
#include <fstream>
#include <filesystem>
#include <thread>
#include <chrono>
#include "httplib.h"

#define DEFAULT_PORT 8080

std::string jsonContent;

std::string readFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Failed to open file: " << filename << std::endl;
        return "";
    }
    return std::string((std::istreambuf_iterator<char>(file)), 
                      std::istreambuf_iterator<char>());
}

void watchFileChanges(httplib::Server& server, const std::string& filename) {
    auto last_write_time = std::filesystem::last_write_time(filename);
    while (true) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        auto current_write_time = std::filesystem::last_write_time(filename);
        if (current_write_time != last_write_time) {
            last_write_time = current_write_time;
            jsonContent = readFile(filename);
            std::cout << "\n[INFO] resume.json has been updated. Changes will be reflected on next request." << std::endl;
        }
    }
}

int main() {
    jsonContent = readFile("resume.json");
    if (jsonContent.empty()) {
        std::cerr << "Error: Could not read JSON file" << std::endl;
        return 1;
    }

    httplib::Server server;

    server.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    server.Get("/", [](const httplib::Request&, httplib::Response& res) {
        res.set_content(jsonContent, "application/json");
    });

    server.set_base_dir(".");

    int port = DEFAULT_PORT;
    bool server_started = false;
    
    std::thread watcher(watchFileChanges, std::ref(server), "resume.json");
    watcher.detach();

    while (!server_started && port < DEFAULT_PORT + 100) {
        try {
            std::cout << "Starting server on port " << port << "..." << std::endl;
            std::cout << "Server is running and watching for changes in resume.json" << std::endl;
            std::cout << "Access endpoints:" << std::endl;
            std::cout << "  - Resume JSON: http://localhost:" << port << "/resume.json" << std::endl;
            std::cout << "  - Webpage: http://localhost:" << port << "/index.html" << std::endl;
            server.listen("0.0.0.0", port);
            server_started = true;
        } catch (const std::exception& e) {
            std::cerr << "Error on port " << port << ": " << e.what() << std::endl;
            port++;
        }
    }

    if (!server_started) {
        std::cerr << "Failed to start server on any port between " 
                  << DEFAULT_PORT << " and " << (DEFAULT_PORT + 100) << std::endl;
        return 1;
    }

    return 0;
}