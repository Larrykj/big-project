#include <iostream>
#include <thread>
#include <chrono>

// Simulated IoT Data Streamer
int main() {
    std::cout << "OmniLogistics Hardware Bridge is Running! [C++]" << std::endl;
    
    int sensor_id = 1001;
    
    while (true) {
        std::cout << "[Sensor " << sensor_id << "] Data Packet: " << rand() % 100 << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(5));
    }
    
    return 0;
}
