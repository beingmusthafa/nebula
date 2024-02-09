import mongoose from "mongoose";

export default interface ICourses {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: mongoose.Types.ObjectId | string;
  tutor: mongoose.Types.ObjectId | string;
  requirements: string[];
  benefits: string[];
  language: string;
  offers?: mongoose.Types.ObjectId[] | string[];
  isBlocked?: boolean;
}
