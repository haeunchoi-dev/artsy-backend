import { Injectable } from '@/decorators/di-decorator';
import {
  ERROR_NAMES,
  BadRequestError,
  InternalServerError,
} from '@/error/errors';
import JWT from '@/libs/jwt';
import {
  hashPassword,
  comparePassword,
  generateTempPassword,
} from '@/libs/password';
import mailSender from '@/libs/mailSender';

import { IResDBUser } from '@/types/user';
import UserModel from '@/models/user-model';
import UserTempPasswordModel from '@/models/user-temp-password-model';
import UserDto from '@/dto/user-dto';
import TicketModel from '@/models/ticket-model';
import CategoryModel from '@/models/category-model';

@Injectable()
class UserService {
  constructor(
    private readonly userModel: UserModel,
    private readonly userTempPasswordModel: UserTempPasswordModel,
    private readonly ticketModel: TicketModel,
    private readonly categoryModel: CategoryModel,
  ) {}

  private async getAccessTokenAndRefreshToken(userId: string) {
    const accessToken = JWT.getInstance().getSignedAccessToken(userId);
    const refreshToken = await JWT.getInstance().getSignedRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  async signUpWithEmail(displayName: string, email: string, password: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length > 0) {
      throw new BadRequestError(
        ERROR_NAMES.EMAIL_ALREADY_EXISTS,
        'signUpWithEmail - users.length > 0',
      );
    }

    const hashedPassword = await hashPassword(password);
    await this.userModel.create(displayName, email, hashedPassword);
  }

  async checkDuplicatedEmail(email: string) {
    const users = await this.userModel.findByEmail(email);

    return {
      isExists: users.length > 0 ? true : false,
    };
  }

  async loginWithEmail(email: string, password: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.NOT_FOUND_EMAIL,
        'loginWithEmail - users.length === 0',
      );
    }

    const user = users[0];
    const isCorrectPassword = await comparePassword(password, user.password);
    if (!isCorrectPassword) {
      throw new BadRequestError(
        ERROR_NAMES.INCORRECT_PASSWORD,
        'loginWithEmail - incorrect password',
      );
    }

    const { accessToken, refreshToken } =
      await this.getAccessTokenAndRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      userInfo: {
        displayName: user.displayName,
        email: user.email,
        createdDate: user.createdDate,
      },
    };
  }

  async getUserInfo({ userId }: UserDto) {
    return await this.userModel.userInfoByUserId(userId);
  }

  async updateUserInfo(
    { userId }: UserDto,
    displayName: string,
    password?: string,
  ) {
    let _password = password;
    if (_password) {
      _password = await hashPassword(_password);
    }
    await this.userModel.updateUserInfo(userId, displayName, _password);
  }

  async requestTempPassword(email: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.NOT_FOUND_EMAIL,
        'findPassword - users.length === 0',
      );
    }

    const tempPassword = generateTempPassword();
    mailSender.sendTempPassword(email, tempPassword);

    const hashedPassword = await hashPassword(tempPassword);
    await this.userTempPasswordModel.create(email, hashedPassword);
  }

  async tempLogin(email: string, password: string) {
    const users = await this.userTempPasswordModel.findByEmailAndLimitDate(
      email,
      10,
    );

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.DATA_NOT_FOUND,
        'tempLogin - users.length === 0',
      );
    }

    const promiseList = users.map(async (user: IResDBUser) => {
      const isCorrectPassword = await comparePassword(password, user.password);
      return isCorrectPassword;
    });

    const results = await Promise.all(promiseList);
    if (results.every((result) => result === false)) {
      throw new BadRequestError(
        ERROR_NAMES.INCORRECT_PASSWORD,
        'tempLogin - incorrect password',
      );
    }

    await this.userTempPasswordModel.deleteByEmail(email);

    const realUser = (await this.userModel.findByEmail(email))[0];
    const { accessToken, refreshToken } =
      await this.getAccessTokenAndRefreshToken(realUser.id);
    return {
      accessToken,
      refreshToken,
      userInfo: {
        displayName: realUser.displayName,
        email: realUser.email,
        createdDate: realUser.createdDate,
      },
    };
  }

  async checkPassword(userId: string, password: string) {
    const users = await this.userModel.findByUserId(userId);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.DATA_NOT_FOUND,
        'tempLogin - users.length === 0',
      );
    }

    const user = users[0];
    return await comparePassword(password, user.password);
  }

  async getUserStatuctuc({ userId }: UserDto, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const startDateStr = `${startDate.getFullYear()}-${String(
      startDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    const endDateStr = `${endDate.getFullYear()}-${String(
      endDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    const ticketStatuctus = await this.ticketModel.statuctucByUserIdAndDate(
      userId,
      startDateStr,
      endDateStr,
    );

    const categoryStatuctus = await this.categoryModel.statuctucByUserIdAndDate(
      userId,
      startDateStr,
      endDateStr,
    );

    return { ...ticketStatuctus, chart: categoryStatuctus };
  }

  async getUserPercentage({ userId }: UserDto) {
    const date = new Date();
    const now = date.getFullYear();
    const next = now + 1;

    const year = `${now}-01-01`;
    const nextYear = `${next}-01-01`;
    const { user, total } = await this.ticketModel.percentageByUserId(
      userId,
      year,
      nextYear,
    );
    const percentage = Math.round((user.cnt / total.cnt) * 100);
    return { percentage };
  }
}

export default UserService;
