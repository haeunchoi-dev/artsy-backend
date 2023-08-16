import { Injectable } from '../decorators/di-decorator';
import pool from '../db';

@Injectable()
class UserModel {
  constructor() {}

  async findByEmail(email: string) {
    // TODO
    // @ts-ignore
    const result = await pool.promiseQuery(
      `
        SELECT
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
  }

  async create(displayName: string, email: string, password: string) {
    // TODO
    // @ts-ignore
    await pool.promiseQuery(
      `
        INSERT INTO user(display_name, email, password)
        VALUES (?, ?, ?);
      `,
      [displayName, email, password],
    );
  }
}

export default UserModel;
