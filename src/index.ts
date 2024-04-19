import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rootRouter from './routes/index';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT;

// Custom CORS middleware to handle credentials
const corsOptions: cors.CorsOptions = {
  origin: true, // Allow all origins
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1', rootRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello, you are in the root path</h1>")
})

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(`Server healthy on port ${PORT}.`);
  console.log(`Server healthy on port ${PORT}.`);
})

// Middleware to set Access-Control-Allow-Origin dynamically
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
