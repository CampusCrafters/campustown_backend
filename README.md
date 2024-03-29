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

## Usage

To start the server, run:

```
npm start
```

## To setup a PostgresDB for testing using docker

Install docker

1. To start the DB server:

   ```
   docker compose up -d
   ```

2. To stop :

   ```
   docker compose down
   ```

3. Connect db to pgadmin (GUI):

- Go to [Link Text](http://localhost:5050)
- Right click on servers and register a new server
- Under general tab
  - Name: any name
- Under connection tab
  - Host name: db
  - Port: 5432
  - Maintanence database: postgres
  - Username: myuser
  - Password: mypassword
  - Save
