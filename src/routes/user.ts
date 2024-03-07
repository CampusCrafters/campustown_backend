import { Router, Request, Response } from 'express';

const router = Router();

// Sign in
router.post('/signin', async (req: Request, res: Response) => {
  console.log('signed in successfully');
});

export default router;
