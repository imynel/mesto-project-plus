import mongoose from "mongoose";
import validator from "validator";

type TCard = {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId; // почему-то просто ObjectId не работает даже и импортом
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date
}

const cardSchema = new mongoose.Schema<TCard>({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL',
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { versionKey: false })


export default mongoose.model<TCard>('card', cardSchema)