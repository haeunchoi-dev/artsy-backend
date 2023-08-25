import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';
import BaseDto from './base-dto';

export default class CheckDuplicatedEmailDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
