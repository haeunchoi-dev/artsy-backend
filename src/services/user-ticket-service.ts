import { Injectable } from '@/decorators/di-decorator';
import TicketModel from '@/models/ticket-model';

import { ITicket } from '@/types/ticket';
import fileManager from '@/libs/fileManager';

@Injectable()
class UserTicketService {
  constructor(private readonly model: TicketModel) {}

  async getTicketList(userId: string, categoryId: number | null) {
    const result = await this.model.findByUserId(userId, { categoryId });
    return result;
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

  async getTicket(ticketId: number) {
    const result = await this.model.findById(ticketId);

    return result;
  }

  async getTicketTotalCount(userId: string) {
    return await this.model.totalCountByUserId(userId);
  }

  async getTicketTotalPrice(userId: string) {
    return await this.model.totalPriceByUserId(userId);
  }
}

export default UserTicketService;
