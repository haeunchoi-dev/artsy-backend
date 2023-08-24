import bcrypt from 'bcrypt';

import { getRandomLetter } from './common';

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password1: string, password2: string) {
  return await bcrypt.compare(password1, password2);
}

function generateTempPassword() {
  return getRandomLetter(12);
}

export {
  hashPassword,
  comparePassword,
  generateTempPassword
}