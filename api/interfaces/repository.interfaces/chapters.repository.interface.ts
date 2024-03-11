import mongoose, { QueryOptions } from "mongoose";
import IChapters from "../chapters.interface.js";

export default interface IChaptersRepository {
  delete(query: {
    course?: string | mongoose.Types.ObjectId;
    _id?: string | mongoose.Types.ObjectId;
  });

  deleteOne(id: string | mongoose.Types.ObjectId);

  find(
    filter: { course?: string | mongoose.Types.ObjectId },
    options?: QueryOptions
  );

  findOne(filter: object);

  create(data: IChapters);

  count(query?: object);

  update(filter: object, updation: object);

  updateOne(filter: object, updation: object);
}
