import { Injectable } from '../decorators/di-decorator';
import TestModel from '../models/test-model';
import bcrypt from 'bcrypt';
import { ERROR_NAMES, BaadRequestError } from '../error/errors';

@Injectable()
class TestService {
  constructor(private readonly testModel: TestModel) {}

  //async getTicketsTotalCount(userId: string) {
  //  const totalCount = await this.testModel.getTicketsTotalCount(userId);
  //  return totalCount[0];
  //}
}

export default TestService;