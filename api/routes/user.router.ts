import express, { Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userProfileController from "../controllers/user/user.profile.controller.js";
import userCoursesController from "../controllers/user/user.courses.controller.js";
import userPurchaseController from "../controllers/user/user.purchase.controller.js";
import userReviewsController from "../controllers/user/user.reviews.controller.js";
import userProgressController from "../controllers/user/user.progress.controller.js";

const router = express.Router();

router.get(
  "/get-profile",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProfileController.getProfile(req, res, next)
);

router.post(
  "/send-email-change-verification",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProfileController.sendChangeEmailVerification(req, res, next)
);

router.put(
  "/edit-profile",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProfileController.editProfile(req, res, next)
);

router.put(
  "/add-interests",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProfileController.addInterests(req, res, next)
);

router.get(
  "/get-home-data",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userIdentify(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getHomeData(req, res, next)
);

router.get(
  "/get-categories",
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getCategories(req, res, next)
);

router.get(
  "/search-courses",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userIdentify(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.searchCourses(req, res, next)
);

router.get(
  "/get-purchased-courses",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getPurchasedCourses(req, res, next)
);

router.get(
  "/get-course-details/:id",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userIdentify(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getCourseById(req, res, next)
);

router.get(
  "/check-cart-and-wishlist/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.checkCartAndWishlist(req, res, next)
);

router.get(
  "/get-cart-courses",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.getCart(req, res, next)
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

router.get(
  "/get-wishlist-courses",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.getWishlist(req, res, next)
);

router.post(
  "/add-to-wishlist",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.addToWishlist(req, res, next)
);

router.get(
  "/get-reviews/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userReviewsController.getReviews(req, res, next)
);

router.post(
  "/add-review",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userReviewsController.addReview(req, res, next)
);
router.put(
  "/edit-review/:reviewId",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userReviewsController.editReview(req, res, next)
);

router.delete(
  "/delete-review/:reviewId",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userReviewsController.deleteReview(req, res, next)
);

router.post(
  "/remove-from-wishlist",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.removeFromWishlist(req, res, next)
);

router.get(
  "/create-checkout-session",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userPurchaseController.createCheckoutSession(req, res, next)
);

router.get(
  "/get-all-progress",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProgressController.getAllProgress(req, res, next)
);

router.get(
  "/get-course-progress/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProgressController.getCourseProgress(req, res, next)
);

router.post(
  "/add-video-progress",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProgressController.addVideoProgress(req, res, next)
);

router.post(
  "/add-video-progress",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userProgressController.addVideoProgress(req, res, next)
);

router.get(
  "/get-chapter-redirect-info/:courseId/:chapterId",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getChapterRedirectInfo(req, res, next)
);

router.get(
  "/get-course-video/:courseId/:chapterId/:videoOrder",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getVideoDetails(req, res, next)
);

router.get(
  "/get-course-exercise/:courseId/:chapterId/:exerciseOrder",
  (req: Request, res: Response, next: NextFunction) =>
    authMiddleware.userAuth(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    userCoursesController.getExerciseDetails(req, res, next)
);

export default router;
