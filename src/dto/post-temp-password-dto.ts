import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import BaseDto from './base-dto';

export default class PostTempPasswordDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
