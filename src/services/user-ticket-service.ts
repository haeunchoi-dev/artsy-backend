import { Injectable } from '../decorators/di-decorator';
import TicketModel from '../models/ticket-model';

import { ERROR_NAMES, BaadRequestError } from '../error/errors';

@Injectable()
class UserTicketService {
  constructor(private readonly model: TicketModel) {}

  async getTicketList(userId, categoryId) {
    const result = await this.model.findByUserId(userId, { categoryId });

    return result;
  }

  async setTicket(
    userId,
    files,
    { categoryId, title, showDate, place, price, rating, review },
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

  async getTicket(ticketId) {
    const result = await this.model.findById(ticketId);

    return result;
  }
}

export default UserTicketService;
