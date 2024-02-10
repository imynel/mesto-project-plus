import express from 'express'
import mongoose from 'mongoose';
import routesUser from './routes/user'
import routesCard from './routes/card'
const { PORT = 3000 } = process.env

const app = express()

mongoose.connect('mongodb://localhost:27017/mestodb/users');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', routesUser);
app.use('/', routesCard)

app.listen(PORT, () => {
  console.log(`подключены к ${PORT} порту`)
})
