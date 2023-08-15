import bcrypt from 'bcrypt';
import { ERROR_NAMES } from '../error/errors';
import { v4 as uuidv4 } from 'uuid';

import pool from '../db';
import UserModel from '../models/user-model';
import UserService from '../services/user-service';
import UserController from '../controllers/user-controller';

const userModel = new UserModel({ pool, uuidv4 });
const userService = new UserService({
  userModel,
  bcrypt,
  errorNames: ERROR_NAMES,
});
const userController = new UserController({ userService });

export default userController;
