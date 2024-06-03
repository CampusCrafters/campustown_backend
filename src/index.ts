import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import rootRouter from "./routes/index";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost",
    "https://campus-connect-frontend-xi.vercel.app",
    "https://campusconnect-frontend.onrender.com",
    "http://ec2-13-233-31-62.ap-south-1.compute.amazonaws.com:5173",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", rootRouter);
app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Hello, you are in the root path of campus connect backend</h1>"
  );
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(`Server healthy on port ${PORT}.`);
  console.log(`Server healthy on port ${PORT}.`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
