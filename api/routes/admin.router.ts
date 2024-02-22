import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminUsersController from "../controllers/admin/admin.users.controller.js";
import adminCategoriesController from "../controllers/admin/admin.categories.controller.js";
import { parser } from "../utils/parser.js";
import adminBannersController from "../controllers/admin/admin.banners.controller.js";
import adminCoursesController from "../controllers/admin/admin.courses.controller.js";

const router = express.Router();
router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware.adminAuth(req, res, next)
);

router.get(
  "/get-all-users",
  (req: Request, res: Response, next: NextFunction) =>
    adminUsersController.getAll(req, res, next)
);

router.get("/get-user/:id", (req: Request, res: Response, next: NextFunction) =>
  adminUsersController.getOne(req, res, next)
);

router.put(
  "/change-block-status",
  (req: Request, res: Response, next: NextFunction) => {
    adminUsersController.changeBlockStatus(req, res, next);
  }
);

router.get(
  "/get-course/details/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    adminCoursesController.getCourseDetails(req, res, next)
);

router.get(
  "/get-pending-courses",
  (req: Request, res: Response, next: NextFunction) =>
    adminCoursesController.getPending(req, res, next)
);

router.patch(
  "/approve-course/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    adminCoursesController.approveCourse(req, res, next)
);

router.get(
  "/reject-courses/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    adminCoursesController.rejectCourse(req, res, next)
);

router.get(
  "/get-categories",
  (req: Request, res: Response, next: NextFunction) =>
    adminCategoriesController.getAll(req, res, next)
);

router.post(
  "/create-category",
  parser.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminCategoriesController.create(req, res, next)
);

router.put(
  "/edit-category",
  parser.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminCategoriesController.edit(req, res, next)
);

router.delete(
  "/delete-category/:id/move/:targetCategory",
  (req: Request, res: Response, next: NextFunction) =>
    adminCategoriesController.delete(req, res, next)
);

router.get("/get-banners", (req: Request, res: Response, next: NextFunction) =>
  adminBannersController.getBanners(req, res, next)
);

router.post(
  "/add-banner",
  parser.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminBannersController.addBanner(req, res, next)
);

router.put(
  "/edit-banner/:bannerId",
  parser.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminBannersController.editBanner(req, res, next)
);

router.patch(
  "/enable-banner/:bannerId",
  (req: Request, res: Response, next: NextFunction) =>
    adminBannersController.enableBanner(req, res, next)
);
router.patch(
  "/disable-banner/:bannerId",
  (req: Request, res: Response, next: NextFunction) =>
    adminBannersController.disableBanner(req, res, next)
);

router.delete(
  "/delete-banner/:bannerId",
  (req: Request, res: Response, next: NextFunction) =>
    adminBannersController.deleteBanner(req, res, next)
);

export default router;
