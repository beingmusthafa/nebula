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
  model: mongoose.Model<ICourseDoc>;

  find(queryFilter: object, options: QueryOptions): Promise<ICourseDoc[]>;

  count(query: object): Promise<number>;

  findById(
    id: string | mongoose.Types.ObjectId,
    options: QueryOptions
  ): Promise<ICourseDoc>;

  findOne(filter: object, options: QueryOptions): Promise<ICourseDoc[]>;

  findOneAndUpdate(query: object, updation: object): Promise<ICourseDoc>;

  updateMany(query: object, updation: object): Promise<void>;

  updateOne(query: object, updation: object): Promise<void>;

  create(course: ICourses): Promise<ICourseDoc>;

  deleteOne(query: object): Promise<void>;

  deleteMany(query: object): Promise<void>;

  aggregate(pipeline: mongoose.PipelineStage[]): Promise<ICourseDoc>;
}
