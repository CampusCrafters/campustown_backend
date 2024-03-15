import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createUsersTable, addUser } from '../DB/db';

const router = Router();

router.use(bodyParser.json());

router.post('/users', async (req: Request, res: Response) => {
  const { Name, Email, RollNumber, Batch, Branch } = req.body;

  try {
    await createUsersTable();
    await addUser(Name, Email, RollNumber, Batch, Branch);
    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
