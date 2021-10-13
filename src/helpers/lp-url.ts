import { BONDS } from '../constants';
import { getAddresses } from '../constants';

export const lpURL = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.dai_clam) {
    return `https://www.traderjoexyz.com/#/pool/${addresses.DAI_ADDRESS}/${addresses.CLAM_ADDRESS}`;
  }

  throw Error(`LP url doesn't support: ${bond}`);
};
