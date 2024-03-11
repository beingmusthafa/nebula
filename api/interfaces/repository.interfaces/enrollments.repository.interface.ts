import mongoose, { QueryOptions } from "mongoose";

export default interface IEnrollmentsRepository {
  find(filter: object, options?: QueryOptions);

  findOne(query: {
    course?: string | mongoose.Types.ObjectId;
    user?: string | mongoose.Types.ObjectId;
  });

  create(data: {
    course: string | mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId;
    price: number;
  });

  createMany(
    data: {
      course: string | mongoose.Types.ObjectId;
      user: string | mongoose.Types.ObjectId;
      price: number;
    }[]
  );

  count(filter: object);

  aggregate(pipeline: mongoose.PipelineStage[]);
}
