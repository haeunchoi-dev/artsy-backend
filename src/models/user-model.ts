import { Injectable } from '../decorators/di-decorator';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db';

@Injectable()
class UserModel {
  constructor() {}

  async findByEmail(email) {
    const result = await pool.promiseQuery(
      `SELECT * FROM user WHERE user_email = ?`,
      [email],
    );
    return result;
  }

  async create(displayName, email, password) {
    const id = uuidv4();
    const result = await pool.promiseQuery(
      `INSERT INTO user (id, display_name, user_email, user_password) VALUES (?, ?, ?, ?)`,
      [id, displayName, email, password],
    );
    return result;
  }
}

export default UserModel;
