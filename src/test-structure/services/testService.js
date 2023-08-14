import { db } from '@/test-structure/libs';

class TestService {
  async getTest() {
    return db.defaultQuery(async (connection) => {
      const testResult = await connection.query(`SELECT * FROM user`);
      return testResult[0];
    });
  }
}

const _inst = new TestService();
export default _inst;