// routes/index.js
import express from 'express';
import userRouter from './user.js'; // Make sure to include the file extension

const router = express.Router();

router.use('/user', userRouter);

export default router;