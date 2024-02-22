import mongoose from "mongoose";

export default interface ICourses {
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
