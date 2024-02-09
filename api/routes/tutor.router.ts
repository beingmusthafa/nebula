import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { parser } from "../utils/parser.js";
import tutorController from "../controllers/tutor/tutor.controller.js";
const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware.userAuth(req, res, next)
);

router.post(
  "/create-course",
  parser.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) =>
    tutorController.createCourse(req, res, next)
);

router.put(
  "/edit-course",
  parser.single("thumbnail"),
  (req: Request, res: Response, next: NextFunction) =>
    tutorController.editCourse(req, res, next)
);

router.get(
  "/get-categories",
  (req: Request, res: Response, next: NextFunction) =>
    tutorController.getCategories(req, res, next)
);

router.get(
  "/get-category-details/:id",
  (req: Request, res: Response, next: NextFunction) =>
    tutorController.getDetails(req, res, next)
);
export default router;
