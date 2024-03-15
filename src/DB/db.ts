import { Pool } from 'pg';

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'mydatabase', 
  password: 'mypassword',
  port: 5432,
});

export async function createUsersTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        roll_number VARCHAR(20) NOT NULL
      )
    `);
    console.log('Table "users" successfully created or already exists');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error; 
  }
}

export async function addUser(name: string, email: string, roll_number: string): Promise<void> {
  try {
    await pool.query('INSERT INTO users (name, email, roll_number) VALUES ($1, $2, $3)', [
      name,
      email,
      roll_number,
    ]);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error; 
  }
}
