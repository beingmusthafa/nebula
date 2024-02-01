import mongoose from "mongoose";

export default interface CurrentUserInterface {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image: string;
  role: "user" | "admin" | "moderator";
  isBlocked: boolean;
  appointmentCost: number;
  interests: string[];
}
