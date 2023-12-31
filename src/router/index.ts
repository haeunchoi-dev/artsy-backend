import { container } from '../decorators/di-decorator';
import { IRoute } from '../decorators/route-decorator';
import { defaultProcess } from '../libs/api';

import express from 'express';
import UserController from '../controllers/user-controller';
import UserTicketController from '../controllers/user-ticket-controller';
import CategoryController from '../controllers/category-controller';

const router = express.Router();

function registerRoutes(controller: any) {
  const prototype = Object.getPrototypeOf(controller);
  const propertyNames = Object.getOwnPropertyNames(prototype);
  for (const propertyName of propertyNames) {
    if (propertyName !== 'constructor') {
      const route: IRoute = Reflect.getMetadata(
        'route',
        prototype,
        propertyName,
      );
      if (route) {
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
  const categoryController = container.resolve<CategoryController>(
    CategoryController.name,
  );
  registerRoutes(userController);
  registerRoutes(userTicketController);
  registerRoutes(categoryController);

  const root = process.env.ROOT || '/api';
  app.use(root, router);
};
