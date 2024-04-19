import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT;

// Custom CORS middleware to handle credentials
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Check if the origin is allowed
    if (origin === 'http://localhost:5173' || origin === 'https://campus-connect-frontend-xi.vercel.app') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1', rootRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello, you are in the root path</h1>")
})

app.get("/health", (req, res) => {
  res.status(200).json(`Server healthy on port ${PORT}.`);
  console.log(`Server healthy on port ${PORT}.`);
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
