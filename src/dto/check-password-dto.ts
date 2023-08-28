import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import BaseDto from './base-dto';

export default class CheckPasswordDto extends BaseDto {
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
