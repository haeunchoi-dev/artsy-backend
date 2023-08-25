import { Injectable } from '@/decorators/di-decorator';
import db from '@/db';

@Injectable()
class UserTempPasswordModel {
  constructor() {}

  async findByEmailAndLimitDate(email: string, limitMinutes: number) {
    return await db.excuteQuery(async (connection) => {
      const result = await connection.query(
        `
          SELECT
            id,
            email,
            password,
            create_date as createdDate
          FROM user_temp_password
          WHERE email = ? AND create_date > now() - INTERVAL ? MINUTE;
        `,
        [email, limitMinutes],
      );

      return result;
    });
  }

  async create(email: string, password: string) {
    await db.excuteQuery(async (connection) => {
      await connection.query(
        `
          INSERT INTO user_temp_password(email, password)
          VALUES (?, ?);
        `,
        [email, password],
      );
    });
  }

  async deleteByEmail(email: string) {
    await db.excuteQuery(async (connection) => {
      await connection.query(
        `
          DELETE FROM user_temp_password
          WHERE email = ?;
        `,
        [email],
      );
    });
  }
}

export default UserTempPasswordModel;
