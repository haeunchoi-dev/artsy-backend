import mysql from 'mysql';

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

const pool = mysql.createPool({
  //   connectionLimit: 10,
  host: sql_host,
  port: Number(sql_port),
  user: sql_user,
  password: sql_pwd,
  database: sql_db,
});


if (process.env.MODE === 'dev') {
  pool.on('connection', (connection) => {
    connection.config.debug = true;
  });
}

// TODO
// @ts-ignore
function promiseQuery(connection, query, values) {
  return new Promise((resolve, reject) => {
    // TODO
    // @ts-ignore
    connection.query(query, values, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

// TODO
// @ts-ignore
function beginTransaction(connection) {
  return new Promise<void>((resolve, reject) => {
    // TODO
    // @ts-ignore
    connection.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// TODO
// @ts-ignore
function commit(connection) {
  return new Promise<void>((resolve, reject) => {
    // TODO
    // @ts-ignore
    connection.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// TODO
// @ts-ignore
function rollback(connection) {
  return new Promise<void>((resolve, reject) => {
    connection.rollback(() => {
      resolve();
    });
  });
}

// TODO
// @ts-ignore
pool.promiseQuery = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// TODO
// @ts-ignore
pool.executeMultipleQueriesInTransaction = function (queriesWithValues) {
  return new Promise((resolve, reject) => {
    console.log('Transaction start.');
    pool.getConnection(async (err, connection) => {
      if (err) return reject(err);

      try {
        const resultArr = [];
        await beginTransaction(connection);

        for (let i = 0; i < queriesWithValues.length; i++) {
          const result = await promiseQuery(
            connection,
            queriesWithValues[i].query,
            queriesWithValues[i].values,
          );
          resultArr.push(result);
        }

        await commit(connection);
        console.log('Transaction Completed Successfully.');
        resolve(resultArr);
      } catch (error) {
        console.log('Transaction error.');
        await rollback(connection);
        reject(error);
      } finally {
        connection.release();
      }
    });
  });
};

export default pool;
