import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import BaseDto from './base-dto';

export default class CheckPasswordDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*+=-]{8,15}$/)
  password: string;
}
