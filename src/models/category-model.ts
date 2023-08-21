import { Injectable } from '@/decorators/di-decorator';
import db from '@/db';

@Injectable()
class CategoryModel {
  constructor() {}

  async getAllCategories() {
    return db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
          SELECT *
          FROM category
          ORDER BY sort ASC;
        `,
      );

      return result;
    });
  }

  async getCategory(categoryId: number) {
    return db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
          SELECT *
          FROM category
          WHERE id = ?
        `,
        [categoryId],
      );

      return result;
    });
  }
}

export default CategoryModel;
