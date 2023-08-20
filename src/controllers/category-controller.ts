import { Request, Response } from 'express';

import { Injectable } from '@/decorators/di-decorator';
import { Route } from '@/decorators/route-decorator';
import checker from '@/libs/checker';

import CategoryService from '@/services/category-service';

@Injectable()
class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Route('get', '/categories')
  async getAllCategories(req: Request, res: Response) {
    return await this.service.getAllCategories();
  }

  @Route('get', '/categories/:categoryId')
  async getCategory(req: Request, res: Response) {
    const { categoryId } = req.params;

    // TODO dto
    checker.checkRequiredPositiveIntegerParams(Number(categoryId));

    return await this.service.getCategory(Number(categoryId));
  }
}

export default CategoryController;
