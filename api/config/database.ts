import mongoose from "mongoose";
import dotenv from "dotenv";
import { classicNameResolver } from "typescript";

dotenv.config();
async function connectDb() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("connected to Mongodb"))
    .catch((error) => console.log(error));
}

export default connectDb;
