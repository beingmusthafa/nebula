import express, { Request, Response, NextFunction } from "express";
import connectDb from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import authRouter from "./routes/auth.router.js";
import adminRouter from "./routes/admin.router.js";
import userRouter from "./routes/user.router.js";
import tutorRouter from "./routes/tutor.router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import coursesModel from "./models/courses.model.js";
const app = express();
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api", userRouter);

app.use(errorHandler);
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Page not found" });
});
app.listen(3000, () => {
  console.log("Server started");
});
