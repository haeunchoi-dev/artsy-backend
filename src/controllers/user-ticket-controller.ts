import { Injectable } from '@/decorators/di-decorator';
import { Get, Post, Delete, Put } from '@/decorators/route-decorator';
import { Body, Query, Param, Req } from '@/decorators/req-binding-decorator';

import auth, { UserType } from '@/middlewares/auth';
import { tempImageUpload } from '@/middlewares/multer';
import UserTicketService from '@/services/user-ticket-service';
import TicketDto from '@/dto/ticket-dto';
import UserDto from '@/dto/user-dto';

@Injectable()
class UserTicketController {
  constructor(private readonly service: UserTicketService) {}

  @Get('/user/tickets', auth(UserType.user))
  async getTicketList(
    @Req('user') user: UserDto,
    @Query('categoryId') categoryId: number,
    @Query('limit', 0) limit: number,
    @Query('page', 1) page: number,
  ) {
    const ticketList = await this.service.getTicketList(
      user,
      categoryId,
      limit,
      page,
    );
    return { ...ticketList };
  }

  @Post('/user/ticket', auth(UserType.user), tempImageUpload.array('file'))
  async setTicket(
    @Req('user') user: UserDto,
    @Req('files', []) files: Express.Multer.File[],
    @Body() ticketDto: TicketDto,
  ) {
    console.log(files);
    return await this.service.setTicket(user, files, ticketDto);
  }

  @Get('/user/ticket/:ticketId', auth(UserType.user))
  async getTicket(
    @Req('user') user: UserDto,
    @Param('ticketId') ticketId: number,
  ) {
    return await this.service.getTicket(user, ticketId);
  }

  @Put(
    '/user/ticket/:ticketId',
    auth(UserType.user),
    tempImageUpload.array('file'),
  )
  async updateTicket(
    @Req('user') user: UserDto,
    @Param('ticketId') ticketId: number,
    @Body() ticketDto: TicketDto,
    @Req('files', []) files: Express.Multer.File[],
  ) {
    return await this.service.updateTicket(user, ticketId, files, ticketDto);
  }

  @Delete('/user/ticket/:ticketId', auth(UserType.user))
  async deleteTicket(
    @Req('user') user: UserDto,
    @Param('ticketId') ticketId: number,
  ) {
    const ticket = await this.service.deleteTicket(user, ticketId);

    return ticket;
  }

  @Get('/user/ticket-total-count', auth(UserType.user))
  async getTicketTotalCount(@Req('user') user: UserDto) {
    return await this.service.getTicketTotalCount(user);
  }

  @Get('/user/ticket-total-price', auth(UserType.user))
  async getTicketTotalPrice(@Req('user') user: UserDto) {
    return await this.service.getTicketTotalPrice(user);
  }
}

export default UserTicketController;
