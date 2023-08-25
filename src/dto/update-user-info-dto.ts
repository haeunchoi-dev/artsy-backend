import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import BaseDto from './base-dto';

export default class UpdateUserInfoDto extends BaseDto {
  // TODO
  @Expose()
  @IsNotEmpty()
  @IsString()
  //@Length(2, 30)
  @Transform(({ value }: TransformFnParams) => {
    if (typeof(value) === 'string') return value.trim();
  })
  displayName: string;

  // TODO
  @Expose()
  @IsOptional()
  @IsString()
  //@IsNotIn(values: any[])
  //@NotContains(seed: string)
  //@Matches(pattern: RegExp, modifiers?: string)
  //@Length(4, 30)
  password?: string;
}
