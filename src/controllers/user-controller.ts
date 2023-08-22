import { Request, Response } from 'express';
import auth, { UserType } from '@/middlewares/auth';
import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param } from '@/decorators/req-binding-decorator';

import UserService from '@/services/user-service';
import {
  SignUpDto,
  CheckDuplicatedEmailDto,
  LoginDto
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
  async checkDuplicatedEmail(@Body() dto: CheckDuplicatedEmailDto) {
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
}

export default UserController;
