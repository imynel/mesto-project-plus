import { ObjectId } from "bson";
import mongoose from "mongoose";

type TCard = {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date
}

const cardSchema = new mongoose.Schema<TCard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: [{
    type: ObjectId,
    default: []
  }],
  createdAt: [{
    type: Date,
    default: []
  }],
})


export default mongoose.model<TCard>('card', cardSchema)