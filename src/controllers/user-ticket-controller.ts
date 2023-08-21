import { Injectable } from '@/decorators/di-decorator';
import { Route, Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param } from '@/decorators/req-decorator';

import auth, { UserType } from '@/middlewares/auth';
import { tempImageUpload } from '@/middlewares/multer';
import UserTicketService from '@/services/user-ticket-service';
import { Request, Response } from 'express';

interface FileRequest extends Request {
  files?: any;
}

@Injectable()
class UserTicketController {
  constructor(private readonly service: UserTicketService) {}

  @Get('/user/tickets', auth(UserType.user))
  async getTicketList(
    @Param('userId') userId: string,
    @Query('categoryId') categoryId: number,
    @Query('limit', 0) limit: number,
    @Query('lastId') lastId: number,
  ) {
    const ticketList = await this.service.getTicketList(
      userId,
      categoryId,
      limit,
      lastId,
    );
    return { ...ticketList };
  }

  @Route(
    'post',
    '/user/ticket',
    auth(UserType.user),
    tempImageUpload.array('file'),
  )
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
    const userId = req.params.userId;
    const { ticketId } = req.params;

    //TODO
    //string to number

    return await this.service.getTicket(userId, Number(ticketId));
  }

  @Route(
    'put',
    '/user/ticket/:ticketId',
    auth(UserType.user),
    tempImageUpload.array('file'),
  )
  async updateTicket(req: Request, res: Response) {
    const userId = req.params.userId;
    const { ticketId } = req.params;
    const files = req.files || [];

    const { categoryId, title, showDate, place, price, rating, review } =
      req.body;

    //TODO
    // string to number

    return await this.service.updateTicket(userId, Number(ticketId), files, {
      categoryId: Number(categoryId),
      title,
      showDate,
      place,
      price: Number(price),
      rating: Number(rating),
      review,
    });
  }

  @Route('delete', '/user/ticket/:ticketId', auth(UserType.user))
  async deleteTicket(req: Request, res: Response) {
    const userId = req.params.userId;
    const { ticketId } = req.params;

    const ticket = await this.service.deleteTicket(userId, Number(ticketId));

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
