import { Injectable } from '../decorators/di-decorator';
import TicketModel from '../models/ticket-model';

import { ITicket } from '../types/ticket';

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
    const result = await this.model.create(userId, files, {
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
}

export default UserTicketService;
