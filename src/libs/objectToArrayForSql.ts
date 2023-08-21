import { isEmpty } from './common';

function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function objectToArray(obj: any) {
  let filterKey = [];
  let filterValue = [];

  for (const [key, value] of Object.entries(obj)) {
    if (isEmpty(value)) {
      continue;
    }

    let newKey = camelToSnakeCase(key);
    filterKey.push(newKey);
    filterValue.push(value);
  }

  return { filterKey, filterValue };
}

export default objectToArray;
