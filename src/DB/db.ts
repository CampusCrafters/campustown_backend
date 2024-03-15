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
        Name VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL UNIQUE,
        RollNumber VARCHAR(20) NOT NULL UNIQUE,
        Batch INTEGER NOT NULL,
        Branch VARCHAR(50) NOT NULL
      )
      `);
      console.log('Table "users" successfully created or already exists');
    } catch (error) {
      console.error('Error creating table:', error);
      throw error; 
    }
}

export async function addUser(Name: string, Email: string, RollNumber: string, Batch: number, Branch: string): Promise<void> {
    let client;
    try {
      client = await pool.connect();
      await client.query('BEGIN');
  
      // Manually fetch the maximum id value
      const result = await client.query('SELECT MAX(id) AS max_id FROM users');
      const maxId = result.rows[0].max_id || 0; // result is a big object, so we extract max id from that object.
      const newId = maxId + 1;
  
      await client.query('INSERT INTO users (id, Name, Email, RollNumber, Batch, Branch) VALUES ($1, $2, $3, $4, $5, $6)', [
        newId,
        Name,
        Email,
        RollNumber,
        Batch,
        Branch
      ]);
  
      await client.query('COMMIT');
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
      }
      console.error('Error adding user:', error);
      throw error; 
    } finally {
      if (client) {
        client.release();
      }
    }
  }