import express from 'express'
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env

const app = express()

mongoose.connect('mongodb://localhost:27017/mydb');

app.listen(PORT, () => {
  console.log(`подключены к ${PORT} порту`)
})
