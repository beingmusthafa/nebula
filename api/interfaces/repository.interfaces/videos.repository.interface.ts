import mongoose, { QueryOptions } from "mongoose";
import IVideos from "../videos.interface.js";

export default interface IVideosRepository {
  delete(query: {
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  });

  deleteOne(query: {
    _id?: string | mongoose.Types.ObjectId;
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  });

  find(
    filter?: {
      course?: string | mongoose.Types.ObjectId;
      chapter?: string | mongoose.Types.ObjectId;
    },
    options?: QueryOptions
  );

  findOne(query: object);

  create(data: IVideos);

  count(query?: object);

  updateMany(filter: object, updation: object);

  updateOne(filter: object, updation: object);
}
