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
    const ticketList = await this.service.getTicketList(userId, categoryId);
    res.status(200).json({ success: true, artsyData: ticketList });
  }

  @Route('post', '/user/ticket', upload.array('file'))
  async setTicket(req: FileRequest, res: Response) {
    //TODP:body check
    const userId = '1';
    const files = req.files || [];

    const { categoryId, title, showDate, place, price, rating, review } =
      req.body;
    console.log({
      categoryId,
      title,
      showDate,
      place,
      price,
      rating,
      review,
      files,
    });
    await this.service.setTicket(userId, files, {
      categoryId,
      title,
      showDate,
      place,
      price,
      rating,
      review,
    });
    res.status(201).json({ success: true });
  }

  @Route('get', '/user/ticket/:ticketId')
  async getTicket(req: Request, res: Response) {
    const { ticketId } = req.params;

    const ticket = await this.service.getTicket(ticketId);
    res.status(200).json({ success: true, artsyData: ticket });
  }
}

export default UserTicketController;
