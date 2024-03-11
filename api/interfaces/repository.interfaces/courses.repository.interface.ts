import mongoose, { QueryOptions } from "mongoose";
import ICourses from "../courses.interface.js";

interface ICourseDoc extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  imagePublicId?: string;
  category: mongoose.Types.ObjectId | string;
  tutor: mongoose.Types.ObjectId | string;
  requirements: string[];
  benefits: string[];
  language: string;
  discount?: number;
  stage?: string;
  isBlocked?: boolean;
}
export default interface ICoursesRepository {
  find(queryFilter: object, options?: QueryOptions);

  count(query: object): Promise<number>;

  findById(id: string | mongoose.Types.ObjectId, options?: QueryOptions);

  findOne(filter: object, options?: QueryOptions);

  findOneAndUpdate(query: object, updation: object);

  updateMany(query: object, updation: object);

  updateOne(query: object, updation: object);

  create(course: ICourses);

  deleteOne(query: object);

  deleteMany(query: object);

  aggregate(pipeline: mongoose.PipelineStage[]);
}
