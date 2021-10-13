export const trim = (number: number = 0, precision?: number) => {
  const array = number.toString().split('.');
  if (array.length === 1) return number.toString();
  //@ts-ignore
  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join('.');
  return trimmedNumber;
};
