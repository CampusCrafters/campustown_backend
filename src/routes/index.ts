import express, { Request, Response } from "express";
import path from "path";
import userRouter from "./userRoutes";
import projectRouter from "./projectRoutes";

const router = express.Router();

// User routes
router.use("/user", userRouter);

// Project routes
router.use("/project", projectRouter);

// Default route to handle unmatched routes
router.use("*", (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(__dirname, '../../404.html'));
});

export default router;