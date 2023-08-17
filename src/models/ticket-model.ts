import { Injectable } from '@/decorators/di-decorator';
import pool from '@/db';
import objectToArray from '@/libs/objectToArrayForSql';

import { ITicket } from '@/types/ticket';

@Injectable()
class TicketModel {
  constructor() {}

  async findByUserId(userId: string, filter = {}) {
    const transFilter = objectToArray(filter);

    let sql = `SELECT     t.id,
                          t.category_id as categoryId,
                          c.name as categoryName,  
                          c.color as categoryColor, 
                          t.title,
                          t.show_date as showDate,
                          t.place,
                          t.price,
                          t.rating,
                          t.review,
                          t.create_date as createDate,
                          t.update_date as updateDate
                FROM ticket t
                LEFT JOIN category c ON t.category_id = c.id 
                WHERE t.user_id = ?`;

    transFilter.filterKey.forEach((o) => {
      sql += ` AND ${o} = ?`;
    });

    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(sql, [
      userId,
      ...transFilter.filterValue,
    ]);

    // TODO
    // @ts-ignore
    for (const o of result) {
      // TODO
      // @ts-ignore
      o.files = await pool.promiseQuery(
        `select id,
                ticket_id as ticketId,
                image_url as imageUrl,
                original_name as originalName,
                file_name as fileName,
                width,
                height,
                extension,
                file_size as fileSize,
                is_primary as isPrimary,
                create_date as createDate
                from image 
                where ticket_id = ?`,
        [o.id],
      );
    }

    return result;
  }

  async create(
    userId: string,
    files: any[],
    { categoryId, title, showDate, place, price, rating, review }: ITicket,
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
      //console.log(f);
      queryList.push({
        query: `INSERT INTO image (ticket_id,
                image_url,
                original_name,
                file_name,
                width,
                height,
                extension,
                file_size,
                is_primary) 
              VALUES ((select id from ticket WHERE user_id = ? and category_id = ?  ORDER BY id DESC LIMIT 1),?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [
          userId,
          categoryId,
          f.path,
          f.originalname,
          f.filename,
          100,
          100,
          f.mimetype,
          f.size,
          true,
        ],
      });
    });

    // TODO
    // @ts-ignore
    const result = await pool.executeMultipleQueriesInTransaction(queryList);
    return result;
  }

  async findById(ticketId: number) {
    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(
      `SELECT     t.id,
                  t.category_id as categoryId,
                  c.name as categoryName,  
                  c.color as categoryColor, 
                  t.title,
                  t.show_date as showDate,
                  t.place,
                  t.price,
                  t.rating,
                  t.review,
                  t.create_date as createDate,
                  t.update_date as updateDate
                FROM ticket t
                LEFT JOIN category c ON t.category_id = c.id 
                WHERE t.id = ?`,
      [ticketId],
    );

    const ticket = { ...result[0] };
    // TODO
    // @ts-ignore
    ticket.files = await pool.promiseQuery(
      `select id,
                ticket_id as ticketId,
                image_url as imageUrl,
                original_name as originalName,
                file_name as fileName,
                width,
                height,
                extension,
                file_size as fileSize,
                is_primary as isPrimary,
                create_date as createDate
                from image 
                where ticket_id = ?`,
      [ticket.id],
    );

    return ticket;
  }

  async totalCountByUserId(userId: string) {
    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(
      `SELECT   count(id) as total
                FROM ticket 
                WHERE user_id = ?`,
      [userId],
    );

    return result;
  }

  async totalPriceByUserId(userId: string) {
    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(
      `SELECT   sum(price) as totalPrice
                FROM ticket 
                WHERE user_id = ?`,
      [userId],
    );

    return result;
  }
}

export default TicketModel;
