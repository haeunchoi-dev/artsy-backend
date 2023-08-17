//const { ERROR_CODE, createAppError } = require('./appErrorMaker');
//const { EnumOrderStatus } = require('../db/constants');

import { BadRequestError, ERROR_NAMES } from '../error/errors';

class Checker {
  // Common
  private throwBadRequestError(errorLog: string) {
    console.error(errorLog);
    throw new BadRequestError(ERROR_NAMES.INVALID_PARAM);
  }

  private requiredString(value: any, errorLog: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      this.throwBadRequestError(errorLog);
    }
  }

  //#requiredPositiveInteger(num, errorLog) {
  //  if (typeof num !== 'number' || !Number.isInteger(num) || num < 1) {
  //    console.error(errorLog);
  //    this.#throwBadRequestAppError();
  //  }
  //}

  //#requiredArray(arr, errorLog) {
  //  if (!Array.isArray(arr) || arr.length === 0) {
  //    console.error(errorLog);
  //    this.#throwBadRequestAppError();
  //  }
  //}

  //#requiredImageFile(image, errorLog) {
    //  const ALLOW_IMAGE_TYPE = ['image/png', 'image/jpg', 'image/jpeg'];
    //  if (image === null || image.mimetype === undefined || !ALLOW_IMAGE_TYPE.includes(image.mimetype)) {
      //    console.error(errorLog);
      //    this.#throwBadRequestAppError();
      //  }
  //}
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

  //checkRequiredStringArrayParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const array = arguments[i];
  //    this.#requiredArray(array, `Fail - checkRequiredStringArrayParams : ${i}`);

  //    for (let j = 0; j < array.length; j++) {
  //      const param = array[j];
  //      this.#requiredString(param, `Fail - checkRequiredStringArrayParams : ${i}`);
  //    }
  //  }
  //}

  //checkRequiredPositiveIntegerParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const param = arguments[i];
  //    this.#requiredPositiveInteger(Number(param), `Fail - checkRequiredPositiveIntegerParams : ${i}`);
  //  }
  //}

  //checkOptionalStringParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const param = arguments[i];
  //    if (param === undefined) continue;
  //    this.#requiredString(param, `Fail - checkOptionalStringParams : ${i}`);
  //  }
  //}

  //checkOptionalStringOrNullParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const param = arguments[i];
  //    if (param === undefined) continue;
  //    if (param === null || param === 'null') continue;
  //    this.#requiredString(param, `Fail - checkOptionalStringParams : ${i}`);
  //  }
  //}

  //checkOptionalPositiveIntegerParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const param = arguments[i];
  //    if (param === undefined) continue;
  //    this.#requiredPositiveInteger(Number(param), `Fail - checkOptionalPositiveIntegerParams : ${i}`);
  //  }
  //}

  //checkOptionalPositiveIntegerOrNullParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const param = arguments[i];
  //    if (param === undefined) continue;
  //    if (param === null || param === 'null') continue;
  //    this.#requiredPositiveInteger(Number(param), `Fail - checkOptionalPositiveIntegerParams : ${i}`);
  //  }
  //}

  //checkOptionalImageFileParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const param = arguments[i];
  //    if (param === undefined) continue;
  //    this.#requiredImageFile(param, `Fail - checkRequiredImageFile : ${i}`)
  //  }
  //}

  //checkRequiredImageFileArrayParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const array = arguments[i];
  //    this.#requiredArray(array, `Fail - checkRequiredImageFileArrayParams : ${i}`);

  //    for (let j = 0; j < array.length; j++) {
  //      const param = array[j];
  //      this.#requiredImageFile(param, `Fail - checkRequiredImageFileArrayParams : ${i}`)
  //    }
  //  }
  //}

  //checkOptionalImageFileArrayParams() {
  //  for (let i = 0; i < arguments.length; i++) {
  //    const array = arguments[i];
  //    if (array === undefined) continue;
  //    this.#requiredArray(array, `Fail - checkRequiredImageFileArrayParams : ${i}`);

  //    for (let j = 0; j < array.length; j++) {
  //      const param = array[j];
  //      this.#requiredImageFile(param, `Fail - checkRequiredImageFileArrayParams : ${i}`)
  //    }
  //  }
  //}

  //checkMaximumMBFileSize(mb, fileSize) {
  //  const mbToByte = mb * 1024 * 1024;
  //  if (fileSize === undefined || fileSize === null || typeof fileSize !== 'number' || mbToByte < fileSize) {
  //    console.error(`Fail - checkMaximumMBFileSize`);
  //    throw createAppError(ERROR_CODE.badRequest, 'invalid parameter');
  //  }
  //}
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