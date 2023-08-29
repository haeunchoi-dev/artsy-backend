export function Body() {
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
      Reflect.getOwnMetadata('REQ_BODY_METADATA', target, propertyKey) || [];

    metadataParameters.push({ index: parameterIndex, type: parameterType });

    Reflect.defineMetadata(
      'REQ_BODY_METADATA',
      metadataParameters,
      target,
      propertyKey,
    );
  };
}
