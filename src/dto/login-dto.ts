import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import BaseDto from './base-dto';

export default class LoginDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // TODO
  @Expose()
  @IsNotEmpty()
  @IsString()
  //@IsNotIn(values: any[])
  //@NotContains(seed: string)
  //@Matches(pattern: RegExp, modifiers?: string)
  //@Length(4, 30)
  password: string;
}
