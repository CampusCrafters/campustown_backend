import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});