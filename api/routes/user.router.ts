import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userProfileController from "../controllers/user/user.profile.controller.js";
import userCoursesController from "../controllers/user/user.courses.controller.js";

const router = express.Router();

router.get(
  "/profile",
  //   authMiddleware.userAuth,
  (req: Request, res: Response, next: NextFunction) =>
    userProfileController.getProfile
);

router.get(
  "/get-home-courses",
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getHomeCourses(req, res, next)
);

router.get(
  "/get-course-details/:id",
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getCourseById(req, res, next)
);

export default router;
