export const trim = (number: number = 0, precision?: number) => {
  return number.toFixed(precision).toString();
};
