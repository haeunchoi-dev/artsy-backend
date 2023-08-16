import { container } from '../decorators/di-decorator';
import { defaultProcess } from '../libs/api';

import express from 'express';
import UserController from '../controllers/user-controller';
import TestController from '../controllers/test-controller';

const router = express.Router();
function registerRoutes(controller: any) {
  const prototype = Object.getPrototypeOf(controller);
  const propertyNames = Object.getOwnPropertyNames(prototype);
  for (const propertyName of propertyNames) {
    if (propertyName !== 'constructor') {
      const route = Reflect.getMetadata('route', prototype, propertyName);

      if (route) {
        router[route.method](
          route.path,
          defaultProcess(prototype[propertyName].bind(controller)),
        );
      }
    }
  }
}

const userController = container.resolve<UserController>(UserController.name);
const testController = container.resolve<TestController>(TestController.name);

export default (app: express.Application) => {
  registerRoutes(userController);
  registerRoutes(testController);
  
  app.use('/api', router);
};
