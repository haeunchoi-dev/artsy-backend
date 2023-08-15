import { Injectable } from '../decorators/di-decorator';
import UserModel from '../models/user-model';
import bcrypt from 'bcrypt';
import { ERROR_NAMES, BaadRequestError } from '../error/errors';

@Injectable()
class UserService {
  constructor(private readonly userModel: UserModel) {}

  async siginUpWithEmail(displayName, email, password) {
    const user = await this.userModel.findByEmail(email);

    if (user.length > 0) {
      throw new BaadRequestError(ERROR_NAMES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdNewUser = await this.userModel.create(
      displayName,
      email,
      hashedPassword,
    );

    return createdNewUser;
  }
}

export default UserService;
