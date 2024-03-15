import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});