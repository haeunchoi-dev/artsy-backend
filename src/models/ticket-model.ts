import { Injectable } from '@/decorators/di-decorator';
import objectToArray from '@/libs/objectToArrayForSql';
import { ITicket } from '@/types/ticket';
import { IS3ImageFile } from '@/types/image';
import db from '@/db';

@Injectable()
class TicketModel {
  constructor() {}

  async findByUserId(
    userId: string,
    filter = {},
    limit = 0,
    offset = 0,
    page: number,
  ) {
    const transFilter = objectToArray(filter);

    let sql = `SELECT     t.id,
                          t.category_id as categoryId,
                          c.name as categoryName,  
                          c.color as categoryColor, 
                          t.title,
                          t.show_date as showDate,
                          DATE_FORMAT(t.show_date, '%Y-%m-%d %H:%i') as showDateString,
                          t.place,
                          t.price,
                          t.rating,
                          t.review,
                          t.create_date as createDate,
                          t.update_date as updateDate,
                          i.id as "fileId",
                          i.image_url as "fileImageUrl",
                          i.original_name as "fileOriginalName",
                          i.file_name as "fileName",
                          i.width as "fileWidth",
                          i.height as "fileHeight",
                          i.extension as "fileExtension",
                          i.file_size as "fileSize",
                          i.is_primary as "fileIsPrimary",
                          i.create_date as "fileCreateDate"                      
                FROM ticket t
                LEFT JOIN category c ON t.category_id = c.id 
                LEFT JOIN image i ON t.id = i.ticket_id AND i.is_primary = 1
                WHERE t.user_id = ?`;

    let count_sql = `SELECT count(t.id) as count                    
                      FROM ticket t
                      WHERE t.user_id = ? `;

    transFilter.filterKey.forEach((o) => {
      sql += ` AND t.${o} = ?`;
      count_sql += ` AND t.${o} = ?`;
    });

    sql += ` order by show_date asc`;

    if (limit > 0) {
      sql += ` LIMIT ? OFFSET ?`;

      transFilter.filterValue.push(limit);
      transFilter.filterValue.push(offset);
    }

    return await db.excuteQuery(async (connection) => {
      const totalCount = await connection.query(count_sql, [
        userId,
        ...transFilter.filterValue,
      ]);

      const ticketList = await connection.query(sql, [
        userId,
        ...transFilter.filterValue,
      ]);

      return { totalCount: totalCount[0].count, ticketList, page };
    });
  }

  async create(
    userId: string,
    files: IS3ImageFile[],
    { categoryId, title, showDate, place, price, rating, review }: ITicket,
  ) {
    return await db.excuteQueryWithTransaction(async (connection) => {
      const result = await connection.query(
        `INSERT INTO ticket (
        user_id,
        category_id,
        title,
        show_date,
        place,
        price,
        rating,
        review) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, categoryId, title, showDate, place, price, rating, review],
      );

      const ticketId = result.insertId;

      if (files.length > 0) {
        let imageQuery = `INSERT INTO image (
          ticket_id,
          image_url,
          original_name,
          file_name,
          width,
          height,
          extension,
          file_size,
          is_primary) VALUES`;

        const imageInsertValues = files.flatMap((f, i) => {
          imageQuery += ` ${i === 0 ? '' : ','}(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          return [
            ticketId,
            '/api/views/uploads/' + f.filename,
            f.originalname,
            f.filename,
            f.width,
            f.height,
            f.mimetype,
            f.size,
            i === 0,
          ];
        });

        await connection.query(imageQuery, imageInsertValues);
      }

      return { id: ticketId };
    });
  }

  async findById(ticketId: number) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `SELECT   t.id,
                  t.category_id as categoryId,
                  c.name as categoryName,  
                  c.color as categoryColor, 
                  t.title,
                  t.show_date as showDate,
                  DATE_FORMAT(t.show_date, '%Y-%m-%d %H:%i') as showDateString,
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

      ticket.files = await connection.query(
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
    });
  }

  async update(
    ticketId: number,
    files: IS3ImageFile[],
    {
      categoryId,
      title,
      showDate,
      place,
      price,
      rating,
      review,
      removeFileId,
    }: ITicket,
  ) {
    return await db.excuteQueryWithTransaction(async (connection) => {
      await connection.query(
        `UPDATE ticket
         SET   
            category_id = ?,
            title = ?,
            show_date = ?,
            place = ?,
            price = ?,
            rating = ?,
            review = ?
        WHERE
            id = ?`,
        [categoryId, title, showDate, place, price, rating, review, ticketId],
      );

      let deleteFile = [];
      if (files.length > 0 || removeFileId) {
        deleteFile = await connection.query(
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
                  where ticket_id = ?
                  `,
          [ticketId],
        );

        // 기존 파일 삭제
        await connection.query(`DELETE FROM image WHERE ticket_id = ? `, [
          ticketId,
        ]);
      }

      // 새 파일 추가
      if (files.length > 0) {
        let imageQuery = `INSERT INTO image (
          ticket_id,
          image_url,
          original_name,
          file_name,
          width,
          height,
          extension,
          file_size,
          is_primary) VALUES`;

        const imageInsertValues = files.flatMap((f, i) => {
          imageQuery += ` ${i === 0 ? '' : ','}(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          return [
            ticketId,
            '/api/views/uploads/' + f.filename,
            f.originalname,
            f.filename,
            f.width,
            f.height,
            f.mimetype,
            f.size,
            i === 0,
          ];
        });

        await connection.query(imageQuery, imageInsertValues);
      }

      return deleteFile;
    });
  }

  async totalCountByUserId(userId: string) {
    return db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `SELECT  count(id) as total
            FROM ticket 
            WHERE user_id = ?`,
        [userId],
      );

      return result[0];
    });
  }

  async totalPriceByUserId(userId: string) {
    return db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `SELECT   COALESCE(sum(price),0) as totalPrice
        FROM ticket 
        WHERE user_id = ?`,
        [userId],
      );

      return result[0];
    });
  }

  async findUserIdById(ticketId: number) {
    return await db.excuteQuery(async (connection) => {
      return await connection.query(
        `
        SELECT user_id as userId FROM ticket WHERE id = ? 
        `,
        [ticketId],
      );
    });
  }

  async deleteById(ticketId: number) {
    return await db.excuteQueryWithTransaction(async (connection) => {
      const result = await connection.query(
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
        [ticketId],
      );

      await connection.query(
        `
        DELETE FROM image WHERE ticket_id = ?
        `,
        [ticketId],
      );

      await connection.query(
        `
        DELETE FROM ticket WHERE id = ?
        `,
        [ticketId],
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
        SELECT 
          count(id) as cntPerMonth,
          COALESCE(sum(price),0) as pricePerMonth
        FROM ticket
        WHERE user_id = ?
          AND show_date >= ? 
          AND show_date < ?
        `,
        [userId, startDate, endDate],
      );
      return result[0];
    });
  }

  async percentageByUserId(userId: string, year: string, nextYear: string) {
    return await db.excuteQuery(async (connection) => {
      const target = await connection.query(
        `
        SELECT COUNT(id) cnt
        FROM ticket
        WHERE user_id = ?
          AND show_date >= ? 
          AND show_date < ?
        `,
        [userId, year, nextYear],
      );

      const targetCnt = target[0].cnt;

      const user = await connection.query(
        `
        SELECT COUNT(*) cnt
        FROM (
            SELECT COUNT(id) AS ticket_count
            FROM ticket
            WHERE show_date >= ? 
              AND show_date < ?
            GROUP BY user_id
            HAVING ticket_count >= ?
        ) as temp
        `,
        [year, nextYear, targetCnt],
      );

      const total = await connection.query(
        `
        SELECT COUNT(id) cnt
          FROM user
        `,
        [],
      );

      return { user: user[0], total: total[0] };
    });
  }
}

export default TicketModel;
