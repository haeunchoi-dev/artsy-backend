import { Request, Response } from 'express';
import auth, { UserType } from '@/middlewares/auth';
import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param } from '@/decorators/req-binding-decorator';

import UserService from '@/services/user-service';
import {
  SignUpDto,
  UserEmailDto,
  LoginDto,
  UpdateUserInfoDto,
} from '@/dto/user-dto';

@Injectable()
class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/user/sign-up')
  async signUp(@Body() dto: SignUpDto) {
    const { displayName, email, password } = dto;
    await this.service.signUpWithEmail(displayName, email, password);
  }

  @Post('/user/check-duplicated-email')
  async checkDuplicatedEmail(@Body() dto: UserEmailDto) {
    const { email } = dto;
    return await this.service.checkDuplicatedEmail(email);
  }

  @Post('/user/login')
  async login(@Body() dto: LoginDto, res: Response) {
    const { email, password } = dto;

    const result = await this.service.loginWithEmail(email, password);

    const secure = process.env.COOKIE_SECURE === 'true';
    const sameSite = (process.env.COOKIE_SAMESITE as 'none') || 'lax';
    const httpOnly = process.env.COOKIE_HTTPONLY === 'true';

    res.cookie('loginToken', result.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly,
      secure,
      sameSite,
    });

    return {
      ...result.userInfo,
    };
  }

  @Post('/user/logout', auth(UserType.user))
  async logout(_: Request, res: Response) {
    res.clearCookie('loginToken');
  }

  @Get('/user/info', auth(UserType.user))
  async getUserInfo(@Param('userId') userId: string) {
    return await this.service.getUserInfo(userId);
  }

  @Put('/user/info', auth(UserType.user))
  async updateUserDisplayName(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserInfoDto
  ) {
    const { displayName, password } = dto;
    await this.service.updateUserInfo(userId, displayName, password);
  }

  @Post('/user/find-password')
  async findPassword(@Body() dto: UserEmailDto) {

    // TODO
    // 임시 테이블 생성
    await this.service.findPassword(dto.email);
  }
}

export default UserController;
