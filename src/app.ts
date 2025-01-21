import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { CustomRequest } from './types';
import STATUS_CODES from './utils/constants';
import auth from './middlewares/auth';
import cookieParser from 'cookie-parser';
import { logRequest, logError } from './middlewares/logger';
import { errorHandler } from './middlewares/error-handler';
import { errors } from 'celebrate';
import { NotFoundError } from './errors';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(logRequest);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(logError);

app.use(errors());
app.use(errorHandler);

app.use(auth);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
