import mysql from 'mysql2';

class Database {
  #pool = null;

  constructor() {
    const db_host = process.env.DATABASE_HOST;
    const db_user = process.env.DATABASE_USER;
    const db_pwd = process.env.DATABASE_PASSWORD;
    const db_name = process.env.DATABASE_NAME;

    if (db_host === undefined || db_user === undefined || db_pwd === undefined || db_name === undefined) {
      throw new Error('database info is undefiend');
    }

    this.#pool = mysql.createPool({
      host: db_host,
      user: db_user,
      password: db_pwd,
      database: db_name,
      connectionLimit: 30
    });
  }

  async #getConnection() {
    if (this.#pool === null) {
      throw new Error('db pool is null');
    }

    return this.#pool.promise().getConnection((error, connection) => {
      if (error) {
        throw error;
      }

      return connection;
    });
  }

  async defaultQuery(callbackFn) {
    let connection = null;

    try {
      connection = await this.#getConnection();
      return await callbackFn(connection);

    } catch (error) {
      console.error('defaultQuery', error);
      throw error;

    } finally {
      if (connection !== null) {
        connection.release();
      }
    }
  }

  async defaultQueryWithTransaction(callbackFn) {
    let connection = null;

    try {
      connection = await this.#getConnection();

      await connection.beginTransaction();
      const result = await callbackFn(connection);
      await connection.commit();

      return result;

    } catch (error) {
      console.error('defaultQueryWithTransaction', error);

      if (connection !== null) {
        await connection.rollback();
      }

      throw error;

    } finally {
      if (connection !== null) {
        connection.release();
      }
    }
  }
}

const db = new Database();
export default db;