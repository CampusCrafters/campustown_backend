import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createUsersTable, addUser } from '../DB/db';

const router = Router();

router.use(bodyParser.json());

router.post('/users', async (req: Request, res: Response) => {
  const { name, email, roll_number } = req.body;

  try {
    // Ensure table exists
    await createUsersTable();
    
    // Insert data into the database
    await addUser(name, email, roll_number);

    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
