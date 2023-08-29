import { Request, Response } from 'express';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/libs/api';
import auth, { UserType } from '@/middlewares/auth';
import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param, Req } from '@/decorators/req-binding-decorator';

import UserService from '@/services/user-service';
import SignupDto from '@/dto/signup-dto';
import CheckDuplicatedEmailDto from '@/dto/check-duplicated-email-dto';
import LoginDto from '@/dto/login-dto';
import UpdateUserInfoDto from '@/dto/update-user-info-dto';
import PostTempPasswordDto from '@/dto/post-temp-password-dto';
import TempLoginDto from '@/dto/temp-login-dto';
import UserDto from '@/dto/user-dto';
import CheckPasswordDto from '@/dto/check-password-dto';

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
  async getUserInfo(@Req('user') user: UserDto) {
    return await this.service.getUserInfo(user);
  }

  @Put('/user/info', auth(UserType.user))
  async updateUserDisplayName(
    @Req('user') user: UserDto,
    @Body() dto: UpdateUserInfoDto,
  ) {
    const { displayName, password } = dto;
    await this.service.updateUserInfo(user, displayName, password);
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

  @Post('/user/check-password', auth(UserType.user))
  async checkPassword(
    @Req('user') user: UserDto,
    @Body() dto: CheckPasswordDto,
  ) {
    const result = await this.service.checkPassword(user.userId, dto.password);

    return {
      isCorrect: result,
    };
  }

  @Get('/user/statistic', auth(UserType.user))
  async getUserStatuctuc(
    @Req('user') user: UserDto,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return await this.service.getUserStatuctuc(user, year, month);
  }

  @Get('/user/percentage', auth(UserType.user))
  async getUserPercentage(@Req('user') user: UserDto) {
    return await this.service.getUserPercentage(user);
  }
}

export default UserController;
