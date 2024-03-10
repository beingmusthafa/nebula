import mongoose from "mongoose";
import IExercises from "../exercises.interface.js";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IExercisesService {
  create(exercise: IExercises): ServiceResponse;

  edit(
    id: string,
    exercise: {
      question: string;
      options: string[];
      chapter: string | mongoose.Types.ObjectId;
      order: number;
      answer: "A" | "B" | "C" | "D";
    }
  ): ServiceResponse;

  count(
    chapter: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }>;

  deleteExercise(id: string): ServiceResponse;
}
