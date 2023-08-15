import mysql from 'mysql';

const pool = mysql.createPool({
  //   connectionLimit: 10,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'artsy',
});

function promiseQuery(connection, query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

function beginTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function commit(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function rollback(connection) {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      resolve();
    });
  });
}

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
