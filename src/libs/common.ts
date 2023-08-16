export function isEmpty(str: string | number) {
  return typeof str == 'undefined' || str == null || str == '';
}
