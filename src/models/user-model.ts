interface UserModelProps {
  pool: {
    promiseQuery: (query: string, values?: any[]) => Promise<any>;
  };
  uuidv4: () => string;
}

class UserModel {
  private pool: UserModelProps['pool'];
  private uuid: UserModelProps['uuidv4'];

  constructor({ pool, uuidv4 }: UserModelProps) {
    this.pool = pool;
    this.uuid = uuidv4;
  }

  async findByEmail(email) {
    const result = await this.pool.promiseQuery(
      `SELECT * FROM user WHERE user_email = ?`,
      [email],
    );
    return result;
  }

  async create(displayName, email, password) {
    const id = this.uuid();
    const result = await this.pool.promiseQuery(
      `INSERT INTO user (id, display_name, user_email, user_password) VALUES (?, ?, ?, ?)`,
      [id, displayName, email, password],
    );
    return result;
  }
}

export default UserModel;
