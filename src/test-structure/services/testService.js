import { db } from '@/test-structure/libs';

class TestService {
  async signUpWithEmail(email, password, displayName) {
    console.log('email', email);
    console.log('password', password);
    console.log('displayName', displayName);

    await db.defaultQuery(async (connection) => {
      const query = `
        INSERT INTO user(email, password, display_name)
        VALUES (?, ?, ?);
      `;

      await connection.query(
        query,
        [email, password, displayName]
      );
    });
  }

  async checkDuplicatedEmail(email) {
    console.log('email', email);

    return await db.defaultQuery(async (connection) => {
      const query = `
        SELECT id
        FROM user
        WHERE email = ?;
      `;

      const result = await connection.query(
        query,
        [email]
      );

      return result[0];
    });
  }

  async loginWithEmail(email, password) {
    console.log('email', email);
    console.log('password', password);

    // TODO createdDate to timestamp
    return await db.defaultQuery(async (connection) => {
      const query = `
        SELECT
          email,
          display_name as displayName,
          create_date as createdDate
        FROM user
        WHERE email = ?
          AND password = ?;
      `;

      const result = await connection.query(
        query,
        [email, password]
      );

      return result[0];
    });
  }

  async getAllCategories() {
    return await db.defaultQuery(async (connection) => {
      const query = `
        SELECT *
        FROM category
        ORDER BY sort ASC;
      `;

      const result = await connection.query(
        query
      );

      return result[0];
    });
  }

  async getCategory(categoryId) {
    return await db.defaultQuery(async (connection) => {
      const query = `
        SELECT *
        FROM category
        WHERE id = ?
      `;

      const result = await connection.query(
        query,
        [categoryId]
      );

      return result[0];
    });
  }

  async getTicketsTotalCount(userId) {
    return await db.defaultQuery(async (connection) => {
      const query = `
        SELECT
          COUNT(id) as totalCount
        FROM ticket
        WHERE user_id = ?
      `;

      const result = await connection.query(
        query,
        [userId]
      );

      return result[0];
    });
  }
}

const _inst = new TestService();
export default _inst;