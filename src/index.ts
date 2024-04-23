import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rootRouter from './routes/index';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT;

// Define CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",  // Your local frontend URL
    "https://campus-connect-frontend-xi.vercel.app"  // Your production frontend URL
  ],
  credentials: true
};

// Use CORS middleware with defined options
app.use(cors(corsOptions));

// Enable cookie parsing middleware
app.use(cookieParser());

// Enable JSON parsing middleware
app.use(express.json());

// Set up routes
app.use('/api/v1', rootRouter);

// Example root path handler
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello, you are in the root path</h1>")
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(`Server healthy on port ${PORT}.`);
  console.log(`Server healthy on port ${PORT}.`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
