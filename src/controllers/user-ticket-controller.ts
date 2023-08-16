import { Injectable } from '../decorators/di-decorator';
import { Route } from '../decorators/route-decorator';

import upload from '../middlewares/multer';
import UserTicketService from '../services/user-ticket-service';
import { Request, Response } from 'express';

interface FileRequest extends Request {
  files?: any;
}

@Injectable()
class UserTicketController {
  constructor(private readonly service: UserTicketService) {}

  @Route('get', '/user/tickets')
  async getTicketList(req: Request, res: Response) {
    //const userId = req.currentUserId || ''
    const userId = '1';
    const { categoryId } = req.query;

    //TODO
    //string to number

    const ticketList = await this.service.getTicketList(
      userId,
      categoryId ? Number(categoryId) : null,
    );
    return ticketList;
  }

  @Route('post', '/user/ticket', upload.array('file'))
  async setTicket(req: FileRequest, res: Response) {
    //TODP:body check
    const userId = '1';
    const files = req.files || [];

    const { categoryId, title, showDate, place, price, rating, review } =
      req.body;

    //TODO
    // string to number

    return await this.service.setTicket(userId, files, {
      categoryId: Number(categoryId),
      title,
      showDate,
      place,
      price: Number(price),
      rating: Number(rating),
      review,
    });
  }

  @Route('get', '/user/ticket/:ticketId')
  async getTicket(req: Request, res: Response) {
    const { ticketId } = req.params;

    //TODO
    //string to number

    const ticket = await this.service.getTicket(Number(ticketId));
    return ticket;
  }

  @Route('get', '/user/ticket-total-count')
  async getTicketTotalCount(req: Request, res: Response) {
    //const userId = req.currentUserId || ''
    const userId = '1';

    // TODO Checker
    return await this.service.getTicketTotalCount(userId);
  }

  @Route('get', '/user/ticket-total-price')
  async getTicketTotalPrice(req: Request, res: Response) {
    //const userId = req.currentUserId || ''
    const userId = '1';

    // TODO Checker
    return await this.service.getTicketTotalPrice(userId);
  }
}

export default UserTicketController;
