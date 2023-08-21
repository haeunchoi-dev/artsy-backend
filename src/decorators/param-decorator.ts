export function Param(key: string, defaultValue: any = null) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const parameterTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey,
    );
    const parameterType = parameterTypes[parameterIndex];

    let metadataParameters: any[] =
      Reflect.getOwnMetadata('REQ_PARAM_METADATA', target, propertyKey) || [];

    metadataParameters.push({
      index: parameterIndex,
      key,
      defaultValue,
      parameterType,
    });

    Reflect.defineMetadata(
      'REQ_PARAM_METADATA',
      metadataParameters,
      target,
      propertyKey,
    );
  };
}
