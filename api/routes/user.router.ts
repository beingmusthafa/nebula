import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userProfileController from "../controllers/user/user.profile.controller.js";
import userCoursesController from "../controllers/user/user.courses.controller.js";
import userPurchaseController from "../controllers/user/user.purchase.controller.js";

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
  "/get-course-details/:courseId/user/:userId",
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getCourseById(req, res, next)
);

router.post(
  "/check-cart-and-wishlist",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.checkCartAndWishlist(req, res, next)
);

router.post(
  "/add-to-cart",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.addToCart(req, res, next)
);

router.post(
  "/remove-from-cart",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.removeFromCart(req, res, next)
);

router.post(
  "/add-to-wishlist",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.addToWishlist(req, res, next)
);

router.post(
  "/remove-from-wishlist",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.removeFromWishlist(req, res, next)
);
export default router;
