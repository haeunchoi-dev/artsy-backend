import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import BaseDto from './base-dto';

export default class SignupDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9a-zA-Z가-힣]([-_\.]?[0-9a-zA-Z가-힣]){2,14}$/i)
  displayName: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*+=-]{8,15}$/)
  password: string;
}
