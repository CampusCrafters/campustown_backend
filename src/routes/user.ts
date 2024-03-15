import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

const router = Router();

import { Pool } from 'pg';

router.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

pool.query(
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    roll_number VARCHAR(20) NOT NULL
  )`,
  (err, res) => {
    if (err) {
      console.error('Error executing query', err.stack);
    } else {
      console.log('Table "users" successfully created or already exists');
    }
  }
);

router.post('/users', async (req: Request, res: Response) => {
  const { name, email, roll_number } = req.body;

  try {
    // Insert data into the database
    await pool.query('INSERT INTO users (name, email, roll_number) VALUES ($1, $2, $3)', [
      name,
      email,
      roll_number,
    ]);
    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
