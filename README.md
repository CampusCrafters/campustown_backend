# CampusConnect Server

## Settin up locally

1. Clone the repository:

   ```
   git clone -b main https://github.com/CampusCrafters/CampusConnect_Backend.git
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root folder and paste the necessary keys.

4. To start the server, run:

   ```
   npm start
   ```

## Setting up using Docker

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/:

2. Clone the repository:

   ```
   git clone -b main https://github.com/CampusCrafters/CampusConnect_Backend.git
   ```
3. Enter the following commands (enter the root folder):
   
   Pulls the latest version of the image
   ```
   docker compose pull
   ```
   Starts the server
   ```
   docker compose up
   ```
## Connect to postgres DB using pgAdmin (any GUI tool)

Install pgAdmin for desktop

Register a new server with DB credentials.


