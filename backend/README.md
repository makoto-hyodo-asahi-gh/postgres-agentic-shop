# AI Retail Solution Accelerator

## Project Overview
The AI Retail Solution Accelerator

## Getting Started

### Prerequisites
- Docker

### Running the Server

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/retail-solution-accelerator.git
    cd retail-solution-accelerator/backend
    ```

2. **Build and run the Docker containers:**
    ```sh
    docker build . -t retail-solution-accelerator && docker run -d -p 8000:8000 --name ai-retail-solution-accelerator retail-solution-accelerator
    ```

3. **Access the application:**
    Once the containers are up and running, you can access the application at `http://localhost:8000`.

### Stopping the Server
To stop the server, run:
```sh
docker container stop ai-retail-solution-accelerator
```
