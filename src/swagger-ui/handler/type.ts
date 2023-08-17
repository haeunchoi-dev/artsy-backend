export interface ISwaggerDefinition {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: { url: string }[];
  produces: string[];
  tags: { name: string; description: string }[];
  paths?: Record<string, any>;
}

export interface ISwaggerOption {
  definition?: ISwaggerDefinition;
  apis?: [];
}
