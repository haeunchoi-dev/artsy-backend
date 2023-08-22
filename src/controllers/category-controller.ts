import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param } from '@/decorators/req-binding-decorator';

import CategoryService from '@/services/category-service';

@Injectable()
class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('/categories')
  async getAllCategories() {
    return await this.service.getAllCategories();
  }

  @Get('/categories/:categoryId')
  async getCategory(@Param('categoryId') categoryId: number) {
    return await this.service.getCategory(categoryId);
  }
}

export default CategoryController;
