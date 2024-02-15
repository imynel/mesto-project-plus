import express, { Request, Response, NextFunction  } from 'express'
import mongoose from 'mongoose';
import routesUser from './routes/user'
import routesCard from './routes/card'
import auth from './middlewares/auth'
import { createUser, login } from './controllers/user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
const { PORT = 3000 } = process.env

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/signin', login)
app.post('/signup', createUser)

app.use(auth)// когда будет роут логин вставить auth
app.use('/users', routesUser);
app.use('/cards', routesCard)



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
