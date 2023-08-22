import { Injectable } from '@/decorators/di-decorator';
import { ERROR_NAMES, BadRequestError } from '@/error/errors';

import CategoryModel from '@/models/category-model';

@Injectable()
class CategoryService {
  constructor(private readonly categoryModel: CategoryModel) {}

  async getAllCategories() {
    return await this.categoryModel.getAllCategories();
  }

  async getCategory(categoryId: number) {
    const categories = await this.categoryModel.getCategory(categoryId);

    if (categories.length === 0) {
      throw new BadRequestError(ERROR_NAMES.DATA_NOT_FOUND, 'getCategory - categories.length === 0');
    }

    return categories[0];
  }
}

export default CategoryService;
