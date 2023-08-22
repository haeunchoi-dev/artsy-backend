import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param, Req } from '@/decorators/req-binding-decorator';

import auth, { UserType } from '@/middlewares/auth';
import { tempImageUpload } from '@/middlewares/multer';
import UserTicketService from '@/services/user-ticket-service';
import TicketDto from '@/dto/ticket-dto';

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

  @Post('/user/ticket', auth(UserType.user), tempImageUpload.array('file'))
  async setTicket(
    @Param('userId') userId: string,
    @Body() ticketDto: TicketDto,
    @Req('files', []) files: Express.Multer.File[],
  ) {
    return await this.service.setTicket(userId, files, ticketDto);
  }

  @Get('/user/ticket/:ticketId', auth(UserType.user))
  async getTicket(
    @Param('userId') userId: string,
    @Param('ticketId') ticketId: number,
  ) {
    return await this.service.getTicket(userId, ticketId);
  }

  @Put(
    '/user/ticket/:ticketId',
    auth(UserType.user),
    tempImageUpload.array('file'),
  )
  async updateTicket(
    @Param('userId') userId: string,
    @Param('ticketId') ticketId: number,
    @Body() ticketDto: TicketDto,
    @Req('files', []) files: Express.Multer.File[],
  ) {
    return await this.service.updateTicket(userId, ticketId, files, ticketDto);
  }

  @Delete('/user/ticket/:ticketId', auth(UserType.user))
  async deleteTicket(
    @Param('userId') userId: string,
    @Param('ticketId') ticketId: number,
  ) {
    const ticket = await this.service.deleteTicket(userId, ticketId);

    return ticket;
  }

  @Get('/user/ticket-total-count', auth(UserType.user))
  async getTicketTotalCount(@Param('userId') userId: string) {
    return await this.service.getTicketTotalCount(userId);
  }

  @Get('/user/ticket-total-price', auth(UserType.user))
  async getTicketTotalPrice(@Param('userId') userId: string) {
    return await this.service.getTicketTotalPrice(userId);
  }
}

export default UserTicketController;
