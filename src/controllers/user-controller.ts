import { Request, Response } from 'express';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/libs/api';
import auth, { UserType } from '@/middlewares/auth';
import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param } from '@/decorators/req-binding-decorator';

import UserService from '@/services/user-service';
import SignupDto from '@/dto/signup-dto';
import CheckDuplicatedEmailDto from '@/dto/check-duplicated-email-dto';
import LoginDto from '@/dto/login-dto';
import UpdateUserInfoDto from '@/dto/update-user-info-dto';
import PostTempPasswordDto from '@/dto/post-temp-password-dto';
import TempLoginDto from '@/dto/temp-login-dto';

@Injectable()
class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/user/sign-up')
  async signUp(@Body() dto: SignupDto) {
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

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);

    return {
      ...result.userInfo,
    };
  }

  @Post('/user/logout', auth(UserType.user))
  async logout(_: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
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
  async requestTempPassword(@Body() dto: PostTempPasswordDto) {
    await this.service.requestTempPassword(dto.email);
  }

  @Post('/user/temp-login')
  async tempLogin(@Body() dto: TempLoginDto, res: Response) {
    const { email, password } = dto;

    const result = await this.service.tempLogin(email, password);

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);

    return {
      ...result.userInfo,
    };
  }
}

export default UserController;
