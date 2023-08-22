export function Req(key: string, defaultValue: any = null) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    let metadataParameters: any[] =
      Reflect.getOwnMetadata('REQ_METADATA', target, propertyKey) || [];

    metadataParameters.push({
      index: parameterIndex,
      key,
      defaultValue,
    });

    Reflect.defineMetadata(
      'REQ_METADATA',
      metadataParameters,
      target,
      propertyKey,
    );
  };
}
