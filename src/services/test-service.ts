import { Injectable } from '../decorators/di-decorator';
import TestModel from '../models/test-model';
import bcrypt from 'bcrypt';
import { ERROR_NAMES, BaadRequestError } from '../error/errors';

@Injectable()
class TestService {
  constructor(private readonly testModel: TestModel) {}

  //async checkDuplicatedEmail(email: string) {
  //  const users = await this.testModel.findByEmail(email);

  //  return {
  //    isExists: users.length > 0 ? true : false
  //  }
  //}

  //async loginWithEmail(email: string, password: string) {
  //  const hashedPassword = await bcrypt.hash(password, 10);
  //  const users = await this.testModel.findByEmailAndPassword(email, hashedPassword);
  //  console.log('users', users);

  //  //return users;
  //}

  //async getAllCategories() {
  //  const categories = await this.testModel.getAllCategories();
  //  return categories;
  //}

  //async getCategory(categoryId: number) {
  //  const categories = await this.testModel.getCategory(categoryId);

  //  if (categories.length === 0) {
  //    throw new Error('에러처리');
  //  }

  //  return categories[0];
  //}

  //async getTicketsTotalCount(userId: string) {
  //  const totalCount = await this.testModel.getTicketsTotalCount(userId);
  //  return totalCount[0];
  //}
}

export default TestService;