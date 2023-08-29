import promiseMysql from 'promise-mysql';

const sql_host = process.env.SQL_HOST;
const sql_port = process.env.SQL_PORT;
const sql_user = process.env.SQL_USER;
const sql_pwd = process.env.SQL_PASSWORD;
const sql_db = process.env.SQL_DATABASE;

if (
  sql_host === undefined ||
  sql_port === undefined ||
  sql_user === undefined ||
  sql_pwd === undefined ||
  sql_db === undefined
) {
  throw new Error('database info is undefiend');
}

const pool = promiseMysql.createPool({
  //   connectionLimit: 10,
  host: sql_host,
  port: Number(sql_port),
  user: sql_user,
  password: sql_pwd,
  database: sql_db,
});

export class Database {
  constructor() {
    if (process.env.MODE === 'dev') {
      (async () => {
        const _pool = await pool;
        _pool.on('connection', (connection) => {
          connection.config.debug = true;
          //connection.config.dateStrings = true;
        });
      })();
    }
  }

  private async getConnection(): Promise<promiseMysql.PoolConnection> {
    const connection = await (await pool).getConnection();
    return connection;
  }

  public async excuteQuery(
    callbackFn: (connection: promiseMysql.PoolConnection) => Promise<any>,
  ) {
    let connection: promiseMysql.PoolConnection | null = null;

    try {
      connection = await this.getConnection();

      const result = await callbackFn(connection);
      return result;
    } catch (error) {
      console.error('error - excuteQuery', error);
      throw error;
    } finally {
      if (connection !== null) {
        connection.release();
      }
    }
  }

  public async excuteQueryWithTransaction(
    callbackFn: (connection: promiseMysql.PoolConnection) => Promise<any>,
  ) {
    let connection: promiseMysql.PoolConnection | null = null;

    try {
      connection = await this.getConnection();

      await connection.beginTransaction();
      const result = await callbackFn(connection);
      await connection.commit();

      return result;
    } catch (error) {
      console.error('excuteQueryWithTransaction', error);

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

const _inst = new Database();
export default _inst;
