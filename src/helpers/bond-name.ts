import { BONDS } from '../constants';

export const bondName = (bond: string): string => {
  if (bond === BONDS.mim) return 'MIM';
  if (bond === BONDS.mim_time) return 'TIME-MIM LP';

  throw Error(`Bond name doesn't support: ${bond}`);
};
