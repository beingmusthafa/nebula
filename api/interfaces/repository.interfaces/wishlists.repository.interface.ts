import mongoose, { QueryOptions } from "mongoose";

export default interface IWishlistsRepository {
  deleteMany(query: {
    _id?: string | mongoose.Types.ObjectId;
    course?: string | mongoose.Types.ObjectId;
    user?: string | mongoose.Types.ObjectId;
  });

  deleteOne(query: {
    _id?: string | mongoose.Types.ObjectId;
    course?: string | mongoose.Types.ObjectId;
    user?: string | mongoose.Types.ObjectId;
  });

  find(
    filter: { user: string | mongoose.Types.ObjectId },
    options?: QueryOptions
  );

  findOne(query: {
    course: string | mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId;
  });

  create(data: {
    course: string | mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId;
  });

  count(filter: object);
}
