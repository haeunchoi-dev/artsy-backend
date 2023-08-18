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
}

export default UserModel;
