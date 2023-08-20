import { Injectable } from '@/decorators/di-decorator';
import { BadRequestError, ERROR_NAMES, ForbiddenError } from '@/error/errors';
import TicketModel from '@/models/ticket-model';

import { ITicket } from '@/types/ticket';
import fileManager from '@/libs/fileManager';

@Injectable()
class UserTicketService {
  constructor(private readonly model: TicketModel) {}

  async getTicketList(
    userId: string,
    categoryId: number | null,
    perPage: number,
    page: number,
  ) {
    let limit = 0;
    let offset = 0;
    if (perPage > 0) {
      limit = perPage;
      offset = (page - 1) * perPage;
    }

    return await this.model.findByUserId(userId, { categoryId }, limit, offset);
  }

  async setTicket(
    userId: string,
    files: any[],
    { categoryId, title, showDate, place, price, rating, review }: ITicket,
  ) {
    //await fileManager.setMulterFiles(files).resizeImage().uploadFileToS3();
    const newFiles = await (await fileManager.setMulterFiles(files).resizeImages()).uploadFileToS3();

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

    const result = await this.model.deleteById(ticketId);

    //파일서버 파일 삭제

    return result;
  }
}

export default UserTicketService;
