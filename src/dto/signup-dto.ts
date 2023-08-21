import { Expose } from 'class-transformer';
import { IsEmail, validateOrReject } from 'class-validator';
import BaseDto from './base-dto';
import { BadRequestError, ERROR_NAMES } from '@/error/errors';

export default class SignupDto extends BaseDto {
  @Expose()
  displayName: string;
  @Expose()
  @IsEmail()
  email: string;
  @Expose() password: string;

  async validate(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch (error) {
      // Errors:  [
      //   ValidationError {
      //     target: SignupDto {
      //       displayName: '이름 아무거나',
      //       email: 'test',
      //       password: '###'
      //     },
      //     value: 'test',
      //     property: 'email',
      //     children: [],
      //     constraints: { isEmail: 'email must be an email' }
      //   }
      // ]
      throw new BadRequestError(ERROR_NAMES.INVALID_PARAM, error);
    }
  }
}
