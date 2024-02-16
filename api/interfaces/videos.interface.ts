import mongoose from "mongoose";

export default interface IVideos {
  title: string;
  order: number;
  chapter: string | mongoose.Types.ObjectId;
  course: string | mongoose.Types.ObjectId;
  video: string;
  duration: number;
  isBlocked?: boolean;
}
