import mongoose, { QueryOptions } from "mongoose";

export default interface IReviewsRepository {
  create(data: {
    user: string | mongoose.Types.ObjectId;
    course: string | mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  });

  updateOne(filter: object, data: { rating?: number; comment?: string });

  find(filter: object, options?: QueryOptions);

  findOne(filter: object, options?: QueryOptions);

  deleteOne(filter: object);

  deleteMany(filter: object);

  aggregate(pipeline: mongoose.PipelineStage[]);
}
