import { NextFunction, Request, Response } from "express";
import categoriesServiceInstance from "../../services/categories.service.js";
import customError from "../../utils/error.js";
import ICategoriesService from "../../interfaces/service.interfaces/categories.service.interface.js";

class AdminCategoriesController {
  private categoriesService: ICategoriesService;
  constructor(categoriesService: ICategoriesService) {
    this.categoriesService = categoriesService;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoriesService.getAll();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file;
      const { name } = req.body;
      const response = await this.categoriesService.create({ name, image });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file;
      console.log(image);
      const { id, name } = req.body;
      const response = await this.categoriesService.edit(id, {
        name,
        image,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, targetCategory } = req.params;
      const response = await this.categoriesService.delete(id, targetCategory);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new AdminCategoriesController(categoriesServiceInstance);
