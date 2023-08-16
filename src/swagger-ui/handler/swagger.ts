const swaggerOpenApiVersion = '3.0.0';

const swaggerInfo = {
  title: 'Artsy RestFul API',
  version: '0.0.1',
  description: 'Artsy Node.js Swaager, RestFul API 클라이언트 UI',
};

const swaggerProduces = ['application/json'];

const swaggerServers = [
  {
    url: process.env.SWAGGER_ID_URL,
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

interface SwaggerDefinition {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: { url: string }[];
  produces: string[];
  tags: { name: string; description: string }[];
  paths?: { [key: string]: any };
}

interface SwaggerOption {
  definition?: SwaggerDefinition;
  apis?: [];
}

interface SwaggerSetUpOption {
  explorer?: boolean;
}

class Swagger {
  static #uniqueSwaggerInstance: Swagger;
  #paths = [{}];
  #option: SwaggerOption = {};
  #setUpOption: SwaggerSetUpOption = {};

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
        // TODO
        // @ts-ignore
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

  // TODO
  // @ts-ignore
  addAPI(api) {
    this.#paths.push(api);
  }

  #processAPI() {
    const path = {};

    for (let i = 0; i < this.#paths.length; i += 1) {
      for (const [key, value] of Object.entries(this.#paths[i])) {
        // TODO
        // @ts-ignore
        path[key] = value;
      }
    }

    return path;
  }

  getOption(): { apiOption: SwaggerOption; setUpOption: SwaggerSetUpOption } {
    const path = this.#processAPI();
    // TODO
    // @ts-ignore
    this.#option.definition.paths = path;

    return {
      apiOption: this.#option,
      setUpOption: this.#setUpOption,
    };
  }
}

export default Swagger;
