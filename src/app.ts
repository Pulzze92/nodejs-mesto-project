import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { login, createUser } from './controllers/users';
import { validateUserBody, validateAuthentication } from './validators/users';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { errorHandler } from './middlewares/error-handler';
import { logRequest, logError } from './middlewares/logger';
import { limiter } from './middlewares/rateLimiter';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.use(limiter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateAuthentication, login);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(logError);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
