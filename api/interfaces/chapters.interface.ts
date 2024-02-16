import mongoose from "mongoose";

export default interface IChapters {
  title: string;
  order: number;
  course: string | mongoose.Types.ObjectId;
  videos?: mongoose.Types.ObjectId[];
  exercises?: mongoose.Types.ObjectId[];
}
