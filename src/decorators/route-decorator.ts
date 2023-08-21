export interface IRoute {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  middlewares: any[];
}

export function Route(method: string, path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    // descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(
      'route',
      { method, path, middlewares: middlewares || [] },
      target,
      propertyKey,
    );
  };
}
