import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import rootRouter from "./routes/index";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const { PORT, DATABASE_URL } = process.env;
if (!PORT || !DATABASE_URL) {
  console.error("PORT or DATABASE_URL not found in .env file");
  process.exit(1);
}

const corsOptions = {
  origin: ["http://localhost:5173", "https://campustown.in"],
  credentials: true,
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message:
    "Oops, we have received too many requests from you. Please try again after 15 minutes",
});

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(apiLimiter);

app.use("/api/v1", rootRouter);
app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Hello, you are in the root path of campus connect backend!</h1>"
  );
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(`Server healthy on port ${PORT}.`);
  console.log(`Server healthy on port 🤓.`);
});

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
