export function isEmpty(obj: any) {
  return typeof obj == 'undefined' || obj == null || obj == '';
}

export function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function getRandomLetter(length: number) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomNum = getRandomInteger(0, letters.length - 1);
    result += letters.charAt(randomNum);
  }

  return result;
}