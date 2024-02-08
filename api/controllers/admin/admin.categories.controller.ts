import { NextFunction, Request, Response } from "express";
import categoriesServiceInstance, {
  CategoriesService,
} from "../../services/categories.service.js";
import customError from "../../utils/error.js";

class AdminCategoriesController {
  private categoriesService: CategoriesService;
  constructor(categoriesService: CategoriesService) {
    this.categoriesService = categoriesService;
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file;
      const { name } = req.body;
      const category = await this.categoriesService.create({ name, image });
      res.status(201).json(category);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new AdminCategoriesController(categoriesServiceInstance);
