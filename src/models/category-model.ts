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

  async statuctucByUserIdAndDate(
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
        select
          c.name as categoryName,
          count(t.id) as cnt
        from category c
        LEFT JOIN ticket t ON c.id = t.category_id 
              AND t.user_id  = ? AND show_date >= ? AND show_date < ?
        group by c.id, c.name
        `,
        [userId, startDate, endDate],
      );
      return result;
    });
  }
}

export default CategoryModel;
