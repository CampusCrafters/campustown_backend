<<<<<<< Updated upstream
import express from 'express';
import userRouter from './userRoutes';
import projectRouter from './projectRoutes'; 

const router = express.Router();

router.use('/user', userRouter);
router.use('/project', projectRouter);
=======
import express from "express";
import userRouter from "./userRoutes";
import projectRoutes from "./projectRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/project", projectRoutes);
>>>>>>> Stashed changes

export default router;
