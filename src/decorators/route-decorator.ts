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
