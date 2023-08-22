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
    lastId: number | null,
  ) {
    const transFilter = objectToArray(filter);

    let sql = `SELECT     t.id,
                          t.category_id as categoryId,
                          c.name as categoryName,  
                          c.color as categoryColor, 
                          t.title,
                          CONVERT_TZ(t.show_date, '+00:00', '+09:00') as showDate,
                          t.place,
                          t.price,
                          t.rating,
                          t.review,
                          CONVERT_TZ(t.create_date, '+00:00', '+09:00') as createDate,
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
                          CONVERT_TZ(i.create_date, '+00:00', '+09:00') as "fileCreateDate"                      
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

    if (limit > 0) {
      if (lastId) {
        sql += ` AND t.id > ? order by t.id asc`;
        transFilter.filterValue.push(lastId);
      }
      sql += ` LIMIT ?`;

      transFilter.filterValue.push(limit);
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

      return { totalCount: totalCount[0].count, ticketList };
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
            f.s3Url,
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
                  CONVERT_TZ(t.show_date, '+00:00', '+09:00') as showDate,
                  t.place,
                  t.price,
                  t.rating,
                  t.review,
                  CONVERT_TZ(t.create_date, '+00:00', '+09:00') as createDate,
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
                CONVERT_TZ(create_date, '+00:00', '+09:00') as createDate
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
            f.s3Url,
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
        `SELECT   sum(price) as totalPrice
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
}

export default TicketModel;
