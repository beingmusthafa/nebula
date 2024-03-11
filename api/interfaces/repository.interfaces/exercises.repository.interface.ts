import mongoose, { QueryOptions } from "mongoose";
import IExercises from "../exercises.interface.js";

export default interface IExercisesRepository {
  delete(query: {
    _id?: string | mongoose.Types.ObjectId;
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  });

  deleteOne(query: { _id?: string | mongoose.Types.ObjectId });

  find(
    filter: {
      chapter?: string | mongoose.Types.ObjectId;
      course?: string | mongoose.Types.ObjectId;
    },
    options?: QueryOptions
  );

  findOne(query: object);

  updateOne(filter: object, updation: object);

  create(data: IExercises);

  count(filter?: {
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  });
}
