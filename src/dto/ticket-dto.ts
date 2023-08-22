import { Expose, Transform } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import BaseDto from './base-dto';
import { BadRequestError, ERROR_NAMES } from '@/error/errors';

export default class TicketDto extends BaseDto {
  @Expose()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  categoryId: number;
  @Expose()
  title: string;
  @Expose()
  showDate: string;
  @Expose()
  place: string;
  @Expose()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  price: number;
  @Expose()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  rating: number;
  @Expose()
  review: string;
  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null), {
    toClassOnly: true,
  })
  removeFileId: number;

  async validate(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch (error) {
      throw new BadRequestError(ERROR_NAMES.INVALID_PARAM, error);
    }
  }
}
