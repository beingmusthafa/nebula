import { NextFunction, Request, Response } from "express";
import CartsService from "../../services/carts.service.js";
import WishlistsService from "../../services/wishlists.service.js";
import customError from "../../utils/error.js";
class UserPurchaseController {
  private cartsService: CartsService;
  private wishlistsService: WishlistsService;
  constructor() {
    this.cartsService = new CartsService();
    this.wishlistsService = new WishlistsService();
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const response = await this.cartsService.getCart(userId);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      const userId = req.user._id;
      const response = await this.cartsService.addtoCart(userId, courseId);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      const userId = req.user._id;
      const response = await this.cartsService.removeFromCart(userId, courseId);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const response = await this.wishlistsService.getWishlist(userId);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      console.log("this is user", req.user);
      const userId = req.user._id;
      const response = await this.wishlistsService.addToWishlist(
        userId,
        courseId
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      const userId = req.user._id;
      const response = await this.wishlistsService.removeFromWishlist(
        userId,
        courseId
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async checkCartAndWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.user._id;
      const { inCart } = await this.cartsService.checkCart(userId, courseId);
      const { inWishlist } = await this.wishlistsService.checkWishlist(
        userId,
        courseId
      );
      return res.status(200).json({
        success: true,
        message: "Checked cart and wishlist",
        statusCode: 200,
        data: { inCart, inWishlist },
      });
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UserPurchaseController();
