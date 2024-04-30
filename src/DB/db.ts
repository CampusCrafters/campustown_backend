import { Pool } from "pg";

// const pool = new Pool({
//   user: 'myuser',
//   host: 'localhost',
//   database: 'mydatabase',
//   password: 'mypassword',
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function createUsersTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        roll_number VARCHAR(20) NOT NULL UNIQUE,
        batch INTEGER NOT NULL,
        branch VARCHAR(50) NOT NULL
      )
      `);
    console.log('Table "users" successfully created or already exists');
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

export async function createProfileTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile_details (
        profile_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE,
        name VARCHAR(100),
        date_of_birth DATE,
        bio TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) -- Changed from user_id to id
      )
    `);
    console.log('Table "profile_details" successfully created or already exists');
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

export const addUser = async (
  Name: string,
  Email: string,
  RollNumber: string,
  Batch: number,
  Branch: string
): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    // Manually fetch the maximum id value
    const result = await client.query("SELECT MAX(id) AS max_id FROM users");
    const maxId = result.rows[0].max_id || 0; // result is a big object, so we extract max id from that object.
    const newId = maxId + 1;

    await client.query(
      "INSERT INTO users (id, Name, Email, RollNumber, Batch, Branch) VALUES ($1, $2, $3, $4, $5, $6)",
      [newId, Name, Email, RollNumber, Batch, Branch]
    );

    await client.query("COMMIT");
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error adding user:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const checkEmailExists = async (Email: any) => {
  let client;
  try {
    client = await pool.connect();
    await createUsersTable();
    const query = {
      text: "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)",
      values: [Email],
    };
    const result = await client.query(query);
    client.release();
    return result.rows[0].exists; // Returns true or false
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
};
