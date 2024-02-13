import express, { Request, Response, NextFunction  } from 'express'
import mongoose from 'mongoose';
import routesUser from './routes/user'
import routesCard from './routes/card'

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

app.use((req: Request, res: Response, next: NextFunction ) => {
  req.user = {
    id: '65cb53183c3015c0139a2335' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', routesUser);
app.use('/cards', routesCard)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`подключены к ${PORT} порту`)
})
