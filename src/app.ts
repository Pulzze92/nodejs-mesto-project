import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { CustomRequest } from './types';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67698139b361ae396ee0cf93',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
