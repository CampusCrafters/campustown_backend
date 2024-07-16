import express, { Request, Response } from "express";
import path from "path";
import userRouter from "./userRoutes";
import projectRouter from "./projectRoutes";
import eventRouter from "./eventRoutes";

const router = express.Router();

// User routes
router.use("/user", userRouter);

// Project routes
router.use("/project", projectRouter);

// Event routes
 router.use("/event", eventRouter);

// Default route to handle unmatched routes
router.use("*", (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(__dirname, '../../404.html'));
});

export default router;