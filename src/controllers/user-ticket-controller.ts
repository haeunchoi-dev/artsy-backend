import { Injectable } from '../decorators/di-decorator';
import { Route } from '../decorators/route-decorator';

import auth, { UserType } from '../middlewares/auth';
import upload from '../middlewares/multer';
import UserTicketService from '../services/user-ticket-service';
import { Request, Response } from 'express';

interface FileRequest extends Request {
  files?: any;
}

@Injectable()
class UserTicketController {
  constructor(private readonly service: UserTicketService) {}

  @Route('get', '/user/tickets', auth(UserType.user))
  async getTicketList(req: Request, res: Response) {
    const userId = req.params.userId;
    const { categoryId } = req.query;

    //TODO
    //string to number

    const ticketList = await this.service.getTicketList(
      userId,
      categoryId ? Number(categoryId) : null,
    );
    return ticketList;
  }

  @Route('post', '/user/ticket', auth(UserType.user), upload.array('file'))
  async setTicket(req: FileRequest, res: Response) {
    //TODP:body check
    const userId = req.params.userId;
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

  @Route('get', '/user/ticket/:ticketId', auth(UserType.user))
  async getTicket(req: Request, res: Response) {
    const { ticketId } = req.params;

    //TODO
    //string to number

    const ticket = await this.service.getTicket(Number(ticketId));
    return ticket;
  }

  @Route('get', '/user/ticket-total-count', auth(UserType.user))
  async getTicketTotalCount(req: Request, res: Response) {
    const userId = req.params.userId;

    // TODO Checker
    return await this.service.getTicketTotalCount(userId);
  }

  @Route('get', '/user/ticket-total-price', auth(UserType.user))
  async getTicketTotalPrice(req: Request, res: Response) {
    const userId = req.params.userId;

    // TODO Checker
    return await this.service.getTicketTotalPrice(userId);
  }
}

export default UserTicketController;
