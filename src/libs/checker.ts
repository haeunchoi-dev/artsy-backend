import { BadRequestError, ERROR_NAMES } from '@/error/errors';

class Checker {
  // Common
  private throwBadRequestError(errorLog: string) {
    throw new BadRequestError(ERROR_NAMES.INVALID_PARAM, errorLog);
  }

  private requiredString(value: any, errorLog: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      this.throwBadRequestError(errorLog);
    }
  }

  private requiredPositiveInteger(value: any, errorLog: string) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
      this.throwBadRequestError(errorLog);
    }
  }

  private requiredArrayWithContent(value: any, errorLog: string) {
    if (!Array.isArray(value) || value.length === 0) {
      this.throwBadRequestError(errorLog);
    }
  }

  private requiredImageFile(value: any, errorLog: string) {
    const ALLOW_IMAGE_TYPE = ['image/png', 'image/jpg', 'image/jpeg'];
    if (value === null || value.mimetype === undefined || !ALLOW_IMAGE_TYPE.includes(value.mimetype)) {
      this.throwBadRequestError(errorLog);
    }
  }
  // end Common
  
  // Default Checker
  public checkEmailFormat(email: any) {
    this.requiredString(email, `Fail - checkEmailFormat : ${email}`);

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email.toLowerCase())) {
      this.throwBadRequestError(`Fail - checkEmailFormat : ${email}`);
    }
  }

  public checkPhoneNumberFormat(phoneNumber: any) {
    this.requiredString(phoneNumber, `Fail - checkPhoneNumberFormat : ${phoneNumber}`);

    const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regex.test(phoneNumber)) {
      this.throwBadRequestError(`Fail - checkPhoneNumberFormat : ${phoneNumber}`);
    }
  }

  public checkRequiredStringParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      this.requiredString(param, `Fail - checkRequiredStringParams : ${i}`);
    }
  }

  public checkRequiredStringArrayParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const array = args[i];
      this.requiredArrayWithContent(array, `Fail - checkRequiredStringArrayParams : ${i}`);

      for (let j = 0; j < array.length; j++) {
        const param = array[j];
        this.requiredString(param, `Fail - checkRequiredStringArrayParams : ${i}`);
      }
    }
  }

  public checkRequiredPositiveIntegerParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      this.requiredPositiveInteger(Number(param), `Fail - checkRequiredPositiveIntegerParams : ${i}`);
    }
  }

  public checkOptionalStringParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      if (param === undefined) continue;
      this.requiredString(param, `Fail - checkOptionalStringParams : ${i}`);
    }
  }

  public checkOptionalStringOrNullParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      if (param === undefined) continue;
      if (param === null || param === 'null') continue;
      this.requiredString(param, `Fail - checkOptionalStringParams : ${i}`);
    }
  }

  public checkOptionalPositiveIntegerParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      if (param === undefined) continue;
      this.requiredPositiveInteger(Number(param), `Fail - checkOptionalPositiveIntegerParams : ${i}`);
    }
  }

  public checkOptionalPositiveIntegerOrNullParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      if (param === undefined) continue;
      if (param === null || param === 'null') continue;
      this.requiredPositiveInteger(Number(param), `Fail - checkOptionalPositiveIntegerParams : ${i}`);
    }
  }

  public checkOptionalImageFileParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const param = args[i];
      if (param === undefined) continue;
      this.requiredImageFile(param, `Fail - checkRequiredImageFile : ${i}`)
    }
  }

  public checkRequiredImageFileArrayParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const array = args[i];
      this.requiredArrayWithContent(array, `Fail - checkRequiredImageFileArrayParams : ${i}`);

      for (let j = 0; j < array.length; j++) {
        const param = array[j];
        this.requiredImageFile(param, `Fail - checkRequiredImageFileArrayParams : ${i}`)
      }
    }
  }

  public checkOptionalImageFileArrayParams(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const array = args[i];
      if (array === undefined) continue;
      this.requiredArrayWithContent(array, `Fail - checkRequiredImageFileArrayParams : ${i}`);

      for (let j = 0; j < array.length; j++) {
        const param = array[j];
        this.requiredImageFile(param, `Fail - checkRequiredImageFileArrayParams : ${i}`)
      }
    }
  }

  public checkMaximumMBFileSize(mb: number, fileSize: number) {
    const mbToByte = mb * 1024 * 1024;
    if (fileSize === undefined || fileSize === null || typeof fileSize !== 'number' || mbToByte < fileSize) {
      this.throwBadRequestError(`Fail - checkMaximumMBFileSize : need under ${mb}mb`);
    }
  }
  // end Default Checker

  // Special Checker
  //checkOrderProductInfos(products) {
  //  this.#requiredArray(products, `Fail - checkOrderProductInfos`);

  //  for (let i = 0; i < products.length; i++) {
  //    const product = products[i];
  //    this.#requiredString(product.id, `Fail - checkOrderProductInfos : ${i}`);
  //    this.#requiredPositiveInteger(product.amount, `Fail - checkOrderProductInfos : ${i}`);
  //  }
  //}

  //checkUserPasswordFormat(str) {
  //  this.#requiredString(str, `Fail - checkUserPasswordFormat`);

  //  //문자, 숫자, 특수문자 각각 최소 1개 이상, 8~16자리
  //  const regex = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,16}$/;
  //  if (regex.test(str) === false) {
  //    console.error(`Fail - checkUserPasswordFormat`);
  //    this.#throwBadRequestAppError();
  //  }
  //}

  //checkAccessableAdminOrderStatus(status) {
  //  const enumStatusArr = Object.values(EnumOrderStatus);
  //  if (enumStatusArr.includes(status) === false) {
  //    console.error(`Fail - checkAccessableAdminOrderStatus`);
  //    this.#throwBadRequestAppError();
  //  }
  //}
  // end Special Checker
}

const _inst = new Checker();
export default _inst;