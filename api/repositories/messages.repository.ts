import mongoose, { QueryOptions } from "mongoose";
import messagesModel from "../models/messages.model.js";

export class MessagesRepository {
  private model = messagesModel;

  async create(data: { user: string; message: string; course: string }) {
    try {
      (await this.model.create(data)).populate;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(
    courseId: string | mongoose.Types.ObjectId,
    options?: QueryOptions
  ) {
    try {
      return await this.model
        .find({ course: courseId })
        .sort({ createdAt: 1 })
        .populate({ path: "user", select: "name image" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new MessagesRepository();
