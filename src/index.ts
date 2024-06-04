import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import rootRouter from "./routes/index";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost",
    "https://campustown.in"
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
