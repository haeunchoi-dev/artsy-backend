import { Injectable } from '../decorators/di-decorator';
import pool from '../db';

@Injectable()
class TestModel {
  constructor() {}

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
