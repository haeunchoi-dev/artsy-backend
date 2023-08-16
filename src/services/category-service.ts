import { Injectable } from '../decorators/di-decorator';
import CategoryModel from '../models/category-model';
//import { ERROR_NAMES, BaadRequestError } from '../error/errors';

@Injectable()
class CategoryService {
  constructor(private readonly categoryModel: CategoryModel) {}

  async getAllCategories() {
    return await this.categoryModel.getAllCategories();
  }
}

export default CategoryService;
