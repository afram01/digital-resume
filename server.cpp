#include <iostream>
#include <string>
#include <fstream>
#include "httplib.h" 

// پورت پیش‌فرض
#define DEFAULT_PORT 8080

std::string readFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Failed to open file: " << filename << std::endl;
        return "";
    }
    return std::string((std::istreambuf_iterator<char>(file)), 
                      std::istreambuf_iterator<char>());
}

int main() {
    // خواندن فایل JSON
    std::string jsonContent = readFile("resume.json");
    if (jsonContent.empty()) {
        std::cerr << "Error: Could not read JSON file" << std::endl;
        return 1;
    }

    // ایجاد سرور
    httplib::Server server;

    // تنظیم CORS headers
    server.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    // هندلر برای درخواست GET
    server.Get("/", [&jsonContent](const httplib::Request&, httplib::Response& res) {
        res.set_content(jsonContent, "application/json");
    });

    // هندلر برای فایل‌های استاتیک
    server.set_base_dir(".");

    int port = DEFAULT_PORT;
    bool server_started = false;
    
    // تلاش برای راه‌اندازی سرور با پورت پیش‌فرض یا پورت‌های بعدی
    while (!server_started && port < DEFAULT_PORT + 100) {
        try {
            std::cout << "Attempting to start server on port " << port << std::endl;
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

    std::cout << "Server successfully started on port " << port << std::endl;
    return 0;
}