import { Injectable } from '../decorators/di-decorator';
import pool from '../db';
import objectToArray from '../libs/objectToArrayForSql';

@Injectable()
class TicketModel {
  constructor() {}

  async findByUserId(userId, filter = {}) {
    const transFilter = objectToArray(filter);

    let sql = 'SELECT * FROM ticket WHERE user_id = ?';

    transFilter.filterKey.forEach((o) => {
      sql += ` AND ${o} = ?`;
    });

    console.log(sql);
    console.log([userId, ...transFilter.filterValue]);
    const result = await pool.promiseQuery(sql, [
      userId,
      ...transFilter.filterValue,
    ]);
    console.log(result);
    return result;
  }

  async create(
    userId,
    files,
    { categoryId, title, showDate, place, price, rating, review },
  ) {
    const queryList = [];
    queryList.push({
      query: `INSERT INTO ticket (user_id,
              category_id,
              title,
              show_date,
              place,
              price,
              rating,
              review) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      values: [
        userId,
        categoryId,
        title,
        showDate,
        place,
        price,
        rating,
        review,
      ],
    });

    files.forEach((f) => {
      queryList.push({
        query: `INSERT INTO ticket (ticket_id,
                image_url,
                original_name,
                file_name,
                width,
                height,
                extension,
                file_size,
                is_primary) 
              VALUES ((select id from ticket WHERE user_id = ? and categoryId = ?  ORDER BY num DESC LIMIT 1),
                       ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          userId,
          categoryId,
          f.path,
          f.originalname,
          f.filename,
          100,
          100,
          f.minetype,
          f.size,
          true,
        ],
      });
    });

    const result = await pool.executeMultipleQueriesInTransaction(queryList);
    return result;
  }

  async findById(ticketId) {
    const result = await pool.promiseQuery(
      `SELECT * FROM ticket WHERE ticket_Id = ?`,
      [ticketId],
    );
    return result;
  }
}

export default TicketModel;
