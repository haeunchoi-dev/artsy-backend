import { Injectable } from '../decorators/di-decorator';
import CategoryModel from '../models/category-model';
//import { ERROR_NAMES, BaadRequestError } from '../error/errors';

@Injectable()
class CategoryService {
  constructor(private readonly categoryModel: CategoryModel) {}

  async getAllCategories() {
    return await this.categoryModel.getAllCategories();
  }

  async getCategory(categoryId: number) {
    const categories = await this.categoryModel.getCategory(categoryId);

    if (categories.length === 0) {
      // TODO
      throw new Error('에러를 던질지, null을 반환할지');
    }

    return categories[0];
  }
}

export default CategoryService;
