import mongoose from "mongoose";

export default interface IExercises {
  order: number;
  chapter: string | mongoose.Types.ObjectId;
  course: string | mongoose.Types.ObjectId;
  question: string;
  options: string[];
  answer: "A" | "B" | "C" | "D";
}
