FROM gcc:latest
WORKDIR /usr/src/app
COPY main.cpp .
RUN g++ -o hardware-bridge main.cpp
CMD ["./hardware-bridge"]
