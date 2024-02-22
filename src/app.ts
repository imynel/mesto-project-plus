import express, { Request, Response, NextFunction, response  } from 'express'
import mongoose from 'mongoose';
import routesUser from './routes/user'
import routesCard from './routes/card'
import auth from './middlewares/auth'
import { createUser, login } from './controllers/user';
import helmet from 'helmet';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import { errors } from 'celebrate';
import { errorLogger, requestLogger } from './middlewares/logger';
import errorsMidlleware from './middlewares/errors'


const { PORT = 3000 } = process.env

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet()); // защита приложения
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger)

app.post('/signin', login)
app.post('/signup', createUser)

app.use(auth)
app.use('/users', routesUser);
app.use('/cards', routesCard)

app.use('*', (req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
})

app.use(errorLogger)

app.use(errors());

app.use(errorsMidlleware)

app.listen(PORT, () => {
  console.log(`подключены к ${PORT} порту`)
})
