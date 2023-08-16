import { Injectable } from '../decorators/di-decorator';
import pool from '../db';

@Injectable()
class TestModel {
  constructor() {}

  //async findByEmailAndPassword(email: string, password: string) {
  //  const result = await pool.promiseQuery(
  //    `
  //      SELECT
  //        email,
  //        display_name as displayName,
  //        create_date as createdDate
  //      FROM user
  //      WHERE email = ?
  //        AND password = ?;
  //    `,
  //    [email, password],
  //  );

  //  return result;
  //}

  //async getAllCategories() {
  //  const result = await pool.promiseQuery(
  //    `
  //      SELECT *
  //      FROM category
  //      ORDER BY sort ASC;
  //    `,
  //  );

  //  return result;
  //}

  //async getCategory(categoryId: number) {
  //  const result = await pool.promiseQuery(
  //    `
  //      SELECT *
  //      FROM category
  //      WHERE id = ?
  //    `,
  //    [categoryId]
  //  );

  //  return result;
  //}

  //async getTicketsTotalCount(userId: string) {
  //  const result = await pool.promiseQuery(
  //    `
  //    SELECT
  //      COUNT(id) as totalCount
  //    FROM ticket
  //    WHERE user_id = ?
  //    `,
  //    [userId]
  //  );

  //  return result;
  //}
}

export default TestModel;
