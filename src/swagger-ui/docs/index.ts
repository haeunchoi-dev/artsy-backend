import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import Swagger from '../handler/swagger';

import user from './api/user';
import category from './api/category';

class ApiDocs {
  #apiDocOption;
  #swagger: Swagger;

  constructor() {
    this.#apiDocOption = { ...user, ...category };

    this.#swagger = new Swagger();
  }

  init() {
    this.#swagger.addAPI(this.#apiDocOption);
  }

  getSwaggerOption() {
    const { apiOption, setUpOption } = this.#swagger.getOption();

    const specs = swaggerJsDoc(apiOption);

    return {
      swaggerUI,
      specs,
      setUpOption,
    };
  }
}

export default ApiDocs;
