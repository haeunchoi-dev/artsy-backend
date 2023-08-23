import { Injectable } from '@/decorators/di-decorator';
import db from '@/db';

@Injectable()
class UserModel {
  constructor() {}

  async findByEmail(email: string) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
          SELECT
            id,
            display_name as displayName,
            email,
            password,
            create_date as createdDate
          FROM user
          WHERE email = ?
        `,
        [email],
      );

      return result;
    });
  }

  async findByUserId(userId: string) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
          SELECT
            id,
            display_name as displayName,
            email,
            password,
            create_date as createdDate
          FROM user
          WHERE id = ?
        `,
        [userId],
      );

      return result;
    });
  }

  async create(displayName: string, email: string, password: string) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
          INSERT INTO user(display_name, email, password)
          VALUES (?, ?, ?);
        `,
        [displayName, email, password],
      );

      return result;
    });
  }

  async userInfoByUserId(userId: string) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
        SELECT
          u.display_name as displayName,
          u.email,
          u.create_date as createdDate,
          count(t.id) as totalTicket
        FROM user u
        LEFT JOIN ticket t ON t.user_id  = u.id 
        WHERE u.id = ?
        group by u.display_name, u.email, u.create_date
        `,
        [userId],
      );

      return result[0];
    });
  }

  async updateUserDisplayName(userId: string, displayName: string) {
    await db.excuteQuery(async (connection) => {
      await connection.query(
        `
          UPDATE user
          SET display_name = ?
          WHERE id = ?
        `,
        [displayName, userId],
      );
    });
  }

  async updateUserPassword(userId: string, password: string) {
    await db.excuteQuery(async (connection) => {
      await connection.query(
        `
          UPDATE user
          SET password = ?
          WHERE id = ?
        `,
        [password, userId],
      );
    });
  }
}

export default UserModel;
