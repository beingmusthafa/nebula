import mongoose, { QueryOptions } from "mongoose";

export default interface IMessagesRepository {
  create(data: { user: string; message: string; course: string });

  find(courseId: string | mongoose.Types.ObjectId, options?: QueryOptions);
}
