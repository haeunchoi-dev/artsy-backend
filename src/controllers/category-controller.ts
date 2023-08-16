import { Injectable } from '../decorators/di-decorator';
import { Route } from '../decorators/route-decorator';

import CategoryService from '../services/category-service';
import { Request, Response } from 'express';

@Injectable()
class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Route('get', '/categories')
  async getAllCategories(req: Request, res: Response) {
    return await this.service.getAllCategories();
  }
}

export default CategoryController;
