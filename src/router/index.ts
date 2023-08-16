import { container } from '../decorators/di-decorator';
import { defaultProcess } from '../libs/api';

import express from 'express';
import UserController from '../controllers/user-controller';
import UserTicketController from '../controllers/user-ticket-controller';

const router = express.Router();
function registerRoutes(controller: any) {
  const prototype = Object.getPrototypeOf(controller);
  const propertyNames = Object.getOwnPropertyNames(prototype);
  for (const propertyName of propertyNames) {
    if (propertyName !== 'constructor') {
      const route = Reflect.getMetadata('route', prototype, propertyName);
      if (route) {
        // TODO
        // @ts-ignore
        router[route.method](
          route.path,
          ...route.middlewares,
          defaultProcess(prototype[propertyName].bind(controller)),
        );
      }
    }
  }
}


export default (app: express.Application) => {
  const userController = container.resolve<UserController>(UserController.name);
  const userTicketController = container.resolve<UserTicketController>(
    UserTicketController.name,
  );
  registerRoutes(userController);
  registerRoutes(userTicketController);

  app.use('/api', router);
};
