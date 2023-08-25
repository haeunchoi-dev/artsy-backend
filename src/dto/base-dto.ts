import { validateOrReject } from 'class-validator';
import { BadRequestError, ERROR_NAMES } from '@/error/errors';

export default class BaseDto {
  async validate(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch (error) {
      throw new BadRequestError(ERROR_NAMES.INVALID_PARAM, error);
    }
  }
}
