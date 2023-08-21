import { ISwaggerOption } from './type';

const swaggerOpenApiVersion = '3.0.0';

const swaggerInfo = {
  title: 'Artsy RestFul API',
  version: '0.0.1',
  description: 'Artsy Node.js Swaager, RestFul API 클라이언트 UI',
};

const swaggerProduces = ['application/json'];

const swaggerServers = [
  {
    url: process.env.SWAGGER_ID_URL || 'http://localhost:5000',
  },
];

const swaggerTags = [
  {
    name: 'User',
    description: 'User API',
  },
  {
    name: 'Category',
    description: 'Category API',
  },
  {
    name: 'User Ticket',
    description: 'User Ticket API',
  },
];

class Swagger {
  static #uniqueSwaggerInstance: Swagger;
  #paths = [{}];
  #option: ISwaggerOption = {};
  #setUpOption = {};

  /**
   *
   * @returns {Swagger}
   */
  constructor() {
    if (!Swagger.#uniqueSwaggerInstance) {
      this.#init();
      Swagger.#uniqueSwaggerInstance = this;
    }
    return Swagger.#uniqueSwaggerInstance;
  }

  #init() {
    this.#option = {
      definition: {
        openapi: swaggerOpenApiVersion,
        info: swaggerInfo,

        servers: swaggerServers,
        produces: swaggerProduces,
        tags: swaggerTags,
      },
      apis: [],
    };
    this.#setUpOption = {
      explorer: true,
    };
  }

  addAPI(api: any) {
    this.#paths.push(api);
  }

  #processAPI() {
    const path: Record<string, any> = {};

    for (let i = 0; i < this.#paths.length; i += 1) {
      for (const [key, value] of Object.entries(this.#paths[i])) {
        path[key] = value;
      }
    }

    return path;
  }

  getOption() {
    const path = this.#processAPI();

    this.#option.definition!.paths = path;

    return {
      apiOption: this.#option,
      setUpOption: this.#setUpOption,
    };
  }
}

export default Swagger;
