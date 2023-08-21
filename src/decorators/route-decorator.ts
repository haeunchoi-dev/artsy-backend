import { plainToClass } from 'class-transformer';

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

function commonRouter(
  method: string,
  path: string,
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  ...middlewares: any[]
) {
  Reflect.defineMetadata(
    'route',
    { method, path, middlewares: middlewares || [] },
    target,
    propertyKey,
  );

  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const req = args[0];

    const bodys: any[] =
      Reflect.getOwnMetadata('REQ_BODY_METADATA', target, propertyKey) || [];
    const querys: any[] =
      Reflect.getOwnMetadata('REQ_QUERY_METADATA', target, propertyKey) || [];
    const params: any[] =
      Reflect.getOwnMetadata('REQ_PARAM_METADATA', target, propertyKey) || [];

    const reqBody = req.body;
    for (let { index, type } of bodys) {
      const dto = plainToClass(type, reqBody, {
        excludeExtraneousValues: true,
      }) as any;

      await dto.validate();
      args[index] = dto;
    }

    const reqQuery = req.query;
    for (let { index, key, defaultValue, parameterType } of querys) {
      args[index] = reqQuery.hasOwnProperty(key)
        ? parameterType(reqQuery[key])
        : defaultValue;
    }

    const reqParams = req.params;
    for (let { index, key, defaultValue, parameterType } of params) {
      args[index] = reqParams.hasOwnProperty(key)
        ? parameterType(reqParams[key])
        : defaultValue;
    }

    return await originalMethod.apply(this, args);
  };
}

export function Get(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    commonRouter('get', path, target, propertyKey, descriptor, middlewares);
  };
}

export function Post(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    commonRouter('post', path, target, propertyKey, descriptor, middlewares);
  };
}
export function Put(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    commonRouter('put', path, target, propertyKey, descriptor, middlewares);
  };
}
export function Patch(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    commonRouter('patch', path, target, propertyKey, descriptor, middlewares);
  };
}
export function Delete(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    commonRouter('delete', path, target, propertyKey, descriptor, middlewares);
  };
}
