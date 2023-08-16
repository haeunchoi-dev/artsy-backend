import { Injectable } from '../decorators/di-decorator';
import pool from '../db';

@Injectable()
class CategoryModel {
  constructor() {}

  async getAllCategories() {
    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(
      `
        SELECT *
        FROM category
        ORDER BY sort ASC;
      `,
    );

    return result;
  }

  async getCategory(categoryId: number) {
    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(
      `
        SELECT *
        FROM category
        WHERE id = ?
      `,
      [categoryId]
    );

    return result;
  }
}

export default CategoryModel;
