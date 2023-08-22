import { Injectable } from '@/decorators/di-decorator';
import { BadRequestError, ERROR_NAMES, ForbiddenError } from '@/error/errors';
import TicketModel from '@/models/ticket-model';

import { ITicket } from '@/types/ticket';
import { IResDBImageFile } from '@/types/image';
import fileManager from '@/libs/fileManager';

@Injectable()
class UserTicketService {
  constructor(private readonly model: TicketModel) {}

  async getTicketList(
    userId: string,
    categoryId: number | null,
    limit: number,
    lastId: number | null,
  ) {
    return await this.model.findByUserId(userId, { categoryId }, limit, lastId);
  }

  async setTicket(
    userId: string,
    files: Express.Multer.File[],
    { categoryId, title, showDate, place, price, rating, review }: ITicket,
  ) {
    const newFiles = await fileManager.convertTempImageToS3Image(files);

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

  async getTicket(userId: string, ticketId: number) {
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

  async getTicketTotalCount(userId: string) {
    return await this.model.totalCountByUserId(userId);
  }

  async getTicketTotalPrice(userId: string) {
    return await this.model.totalPriceByUserId(userId);
  }

  async updateTicket(
    userId: string,
    ticketId: number,
    files:
      | Express.Multer.File[]
      | {
          [fieldname: string]: Express.Multer.File[];
        },
    { categoryId, title, showDate, place, price, rating, review }: ITicket,
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

    const result = await this.model.update(ticketId, files, {
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

  async deleteTicket(userId: string, ticketId: number) {
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
    const deleteFileKeys = result.map(file => file.fileName);
    fileManager.deleteS3Files(deleteFileKeys);

    return result;
  }
}

export default UserTicketService;
