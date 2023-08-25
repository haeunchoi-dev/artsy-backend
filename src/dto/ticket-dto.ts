import { Expose, Transform } from 'class-transformer';
import { Max, MaxLength, IsNotEmpty } from 'class-validator';
import BaseDto from './base-dto';

export default class TicketDto extends BaseDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @Expose()
  categoryId: number;

  @MaxLength(30)
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsNotEmpty()
  @Expose()
  showDate: string;

  @MaxLength(30)
  @Expose()
  place: string;

  @Max(999999999)
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @Expose()
  price: number;

  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @Expose()
  rating: number;

  @MaxLength(1000)
  @Expose()
  review: string;

  @Transform(({ value }) => (value ? Number(value) : null), {
    toClassOnly: true,
  })
  @Expose()
  removeFileId: number;
}
