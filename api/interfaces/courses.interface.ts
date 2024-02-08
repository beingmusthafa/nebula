import mongoose from "mongoose";

export default interface ICourses {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  requirements: string[];
  benefits: string[];
  offers?: mongoose.Types.ObjectId[];
  isBlocked?: boolean;
}
