import mongoose, { QueryOptions } from "mongoose";

export default interface IBannersRepository {
  find(filter: object, options?: QueryOptions);

  findOne(_id: string | mongoose.Types.ObjectId);

  create(data: { image: string; link: string; imagePublicId: string });

  createMany(
    data: {
      course: string | mongoose.Types.ObjectId;
      user: string | mongoose.Types.ObjectId;
      price: number;
    }[]
  );

  updateOne(
    _id: string | mongoose.Types.ObjectId,
    data: { image?: string; link?: string; isActive?: boolean }
  );

  deleteOne(_id: string | mongoose.Types.ObjectId);
}
