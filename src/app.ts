import express, { Request, Response, NextFunction, response  } from 'express'
import mongoose from 'mongoose';
import routesUser from './routes/user'
import routesCard from './routes/card'
import auth from './middlewares/auth'
import { createUser, login } from './controllers/user';
import helmet from 'helmet';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import { errors } from 'celebrate';


const { PORT = 3000 } = process.env

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet()); // защита приложения
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/signin', login)
app.post('/signup', createUser)

app.use(auth)// когда будет роут логин вставить auth
app.use('/users', routesUser);
app.use('/cards', routesCard)

app.use('*', (req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
})

app.use(errors());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    })
});

app.listen(PORT, () => {
  console.log(`подключены к ${PORT} порту`)
})
