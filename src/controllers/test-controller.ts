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

  //@Route('post', '/user/check-duplicated-email')
  //async checkDuplicatedEmail(req: Request, res: Response) {
  //  const { email } = req.body;

  //  // TODO Checker

  //  return await this.service.checkDuplicatedEmail(email);
  //}

  //@Route('post', '/user/login-with-email')
  //async loginWithEmail(req: Request, res: Response) {
  //  const { email, password } = req.body;

  //  // TODO Checker

  //  const result = await this.service.loginWithEmail(email, password);

  //  const responseData: SuccessResponseData = {
  //    success: true,
  //    //artsyData: result.length === 0 ? null : result[0]
  //  }

  //  res.status(200).json(responseData);
  //}

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
