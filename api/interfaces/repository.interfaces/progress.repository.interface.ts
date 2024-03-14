import mongoose, { QueryOptions } from "mongoose";

export default interface IProgressRepository {
  createMany(
    data: {
      user: string | mongoose.Types.ObjectId;
      course: string | mongoose.Types.ObjectId;
      target: number;
    }[]
  );

  pushToField(
    filter: object,
    field: "videos" | "exercises",
    value: string | mongoose.Types.ObjectId
  );

  pullFromField(
    filter: object,
    field: "videos" | "exercises",
    value: string | mongoose.Types.ObjectId
  );

  find(filter: object, options?: QueryOptions);

  findOne(filter: object, options?: QueryOptions);

  deleteOne(filter: object);

  deleteMany(filter: object);
}
