import bcrypt from 'bcrypt';

import {
  getRandomInteger,
  getRandomLetter,
  getRandomSpecialLetter
} from './common';

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password1: string, password2: string) {
  return await bcrypt.compare(password1, password2);
}

function generateTempPassword() {
  let tempPassword = '';

  tempPassword += getRandomLetter(8);
  tempPassword += getRandomSpecialLetter(2);
  tempPassword += getRandomInteger(0, 9);
  tempPassword += getRandomInteger(0, 9);

  return tempPassword;
}

export {
  hashPassword,
  comparePassword,
  generateTempPassword
}