import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminUsersController from "../controllers/admin/admin.users.controller.js";
import adminCategoriesController from "../controllers/admin/admin.categories.controller.js";
import { parser } from "../utils/parser.js";

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

export default router;
