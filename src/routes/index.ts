import express from "express";
import userRouter from "./userRoutes";
import projectRouter from "./projectRoutes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/project", projectRouter);

export default router;
