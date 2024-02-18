import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { parser } from "../utils/parser.js";
import tutorCoursesController from "../controllers/tutor/tutor.courses.controller.js";
import tutorChaptersController from "../controllers/tutor/tutor.chapters.controller.js";
import tutorExercisesController from "../controllers/tutor/tutor.exercises.controller.js";
import tutorVideosController from "../controllers/tutor/tutor.videos.controller.js";
const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware.userAuth(req, res, next)
);

router.get(
  "/get-all-courses",
  (req: Request, res: Response, next: NextFunction) =>
    tutorCoursesController.getAllCourses(req, res, next)
);

router.post(
  "/create-course",
  parser.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) =>
    tutorCoursesController.createCourse(req, res, next)
);

router.put(
  "/edit-course",
  parser.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) =>
    tutorCoursesController.editCourse(req, res, next)
);

router.delete(
  "/delete-course/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorCoursesController.deleteCourse(req, res, next)
);

router.get(
  "/get-categories",
  (req: Request, res: Response, next: NextFunction) =>
    tutorCoursesController.getCategories(req, res, next)
);

router.get(
  "/get-category-details/:id",
  (req: Request, res: Response, next: NextFunction) =>
    tutorCoursesController.getDetails(req, res, next)
);

router.post("/add-chapter", (req: Request, res: Response, next: NextFunction) =>
  tutorChaptersController.add(req, res, next)
);

router.put(
  "/edit-chapter/:chapterId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorChaptersController.edit(req, res, next)
);

router.get(
  "/get-chapters-count/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorChaptersController.countByCourse(req, res, next)
);

router.delete(
  "/delete-chapter/:chapterId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorChaptersController.delete(req, res, next)
);

router.get(
  "/get-chapters/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorChaptersController.getByCourse(req, res, next)
);

router.post(
  "/add-exercise",
  (req: Request, res: Response, next: NextFunction) =>
    tutorExercisesController.add(req, res, next)
);

router.put(
  "/edit-exercise/:exerciseId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorExercisesController.edit(req, res, next)
);

router.delete(
  "/delete-exercise/:exerciseId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorExercisesController.delete(req, res, next)
);

router.get(
  "/get-exercises-count/:chapterId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorExercisesController.getCount(req, res, next)
);

router.post(
  "/add-video",
  parser.single("video"),
  (req: Request, res: Response, next: NextFunction) =>
    tutorVideosController.add(req, res, next)
);

router.put(
  "/edit-video/:videoId",
  parser.single("video"),
  (req: Request, res: Response, next: NextFunction) =>
    tutorVideosController.edit(req, res, next)
);

router.delete(
  "/delete-video/:videoId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorVideosController.deleteVideo(req, res, next)
);

router.get(
  "/get-videos-count/:chapterId",
  (req: Request, res: Response, next: NextFunction) =>
    tutorVideosController.getCount(req, res, next)
);

export default router;
