import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { CustomRequest } from './types';
import STATUS_CODES from './utils/constants';
import auth from './middlewares/auth';
import cookieParser from 'cookie-parser';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67698139b361ae396ee0cf93',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(auth);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
