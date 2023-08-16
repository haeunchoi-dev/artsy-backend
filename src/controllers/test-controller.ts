import { Injectable } from '../decorators/di-decorator';
import { Route } from '../decorators/route-decorator';

import TestService from '../services/test-service';
import { Request, Response } from 'express';

interface SuccessResponseData {
  success: true,
  artsyData?: Array<Object> | Object | null
}

@Injectable()
class TestController {
  constructor(private readonly service: TestService) {}

  //@Route('get', '/categories')
  //async getAllCategories(req: Request, res: Response) {
  //  return await this.service.getAllCategories();
  //}

  //@Route('get', '/categories/:categoryId')
  //async getCategory(req: Request, res: Response) {
  //  const { categoryId } = req.params;
  //  console.log('categoryId', categoryId);

  //  // TODO Checker
  //  // TODO String to Number

  //  return await this.service.getCategory(Number(categoryId));
  //}

  //@Route('get', '/tickets/total-count')
  //async getTicketsTotalCount(req: Request, res: Response) {
  //  // TODO get userId from token

  //  const testUserId = 'd7b47b50-3b3c-11ee-8868-244bfecb3b3f';

  //  return await this.service.getTicketsTotalCount(testUserId);
  //}
}

export default TestController;
