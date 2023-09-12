import { Injectable } from '@/decorators/di-decorator';
import { BadRequestError, ERROR_NAMES, ForbiddenError } from '@/error/errors';
import TicketModel from '@/models/ticket-model';

import { IResDBImageFile, IS3ImageFile } from '@/types/image';
import fileManager from '@/libs/fileManager';
import TicketDto from '@/dto/ticket-dto';

import UserDto from '@/dto/user-dto';

@Injectable()
class UserTicketService {
  constructor(private readonly model: TicketModel) {}

  async getTicketList(
    { userId }: UserDto,
    categoryId: number | null,
    limit: number,
    page: number,
  ) {
    let offset = 0;
    if (limit > 0) {
      offset = (page - 1) * limit;
    }

    return await this.model.findByUserId(
      userId,
      { categoryId },
      limit,
      offset,
      page,
    );
  }

  async setTicket(
    { userId }: UserDto,
    files: Express.Multer.File[],
    { categoryId, title, showDate, place, price, rating, review }: TicketDto,
  ) {
    const newFiles: IS3ImageFile[] =
      await fileManager.convertTempImageToS3Image(files);

    const result = await this.model.create(userId, newFiles, {
      categoryId,
      title,
      showDate,
      place,
      price,
      rating,
      review,
    });

    return result;
  }

  async getTicket({ userId }: UserDto, ticketId: number) {
    const ticket = await this.model.findUserIdById(ticketId);

    if (ticket.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.DATA_NOT_FOUND,
        'not found ticket.',
      );
    }

    if (ticket[0].userId !== userId) {
      throw new ForbiddenError(ERROR_NAMES.FORBIDDEN, 'not found ticket.');
    }
    const result = await this.model.findById(ticketId);

    return result;
  }

  async getTicketTotalCount({ userId }: UserDto) {
    return await this.model.totalCountByUserId(userId);
  }

  async getTicketTotalPrice({ userId }: UserDto) {
    return await this.model.totalPriceByUserId(userId);
  }

  async updateTicket(
    { userId }: UserDto,
    ticketId: number,
    files: Express.Multer.File[],
    {
      categoryId,
      title,
      showDate,
      place,
      price,
      rating,
      review,
      removeFileId,
    }: TicketDto,
  ) {
    const ticket = await this.model.findUserIdById(ticketId);

    if (ticket.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.DATA_NOT_FOUND,
        'not found ticket.',
      );
    }

    if (ticket[0].userId !== userId) {
      throw new ForbiddenError(ERROR_NAMES.FORBIDDEN, 'not found ticket.');
    }

    const newFiles: IS3ImageFile[] =
      await fileManager.convertTempImageToS3Image(files);

    const result: IResDBImageFile[] = await this.model.update(
      ticketId,
      newFiles,
      {
        categoryId,
        title,
        showDate,
        place,
        price,
        rating,
        review,
        removeFileId,
      },
    );

    //const deleteFileKeys = result.map((file) => file.fileName);
    //fileManager.deleteS3Files(deleteFileKeys);

    return result;
  }

  async deleteTicket({ userId }: UserDto, ticketId: number) {
    const ticket = await this.model.findUserIdById(ticketId);

    if (ticket.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.DATA_NOT_FOUND,
        'not found ticket.',
      );
    }

    if (ticket[0].userId !== userId) {
      throw new ForbiddenError(ERROR_NAMES.FORBIDDEN, 'not found ticket.');
    }

    const result: IResDBImageFile[] = await this.model.deleteById(ticketId);
    //const deleteFileKeys = result.map((file) => file.fileName);
    //fileManager.deleteS3Files(deleteFileKeys);

    return result;
  }
}

export default UserTicketService;
