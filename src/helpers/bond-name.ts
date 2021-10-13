import { BONDS } from '../constants';

export const bondName = (bond: string): string => {
  if (bond === BONDS.dai) return 'DAI';
  if (bond === BONDS.dai_clam) return 'CLAM-DAI LP';

  throw Error(`Bond name doesn't support: ${bond}`);
};
