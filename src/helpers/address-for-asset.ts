import { getAddresses, BONDS } from '../constants';

export const addressForAsset = (bond: string, networkID: number): string => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.dai) {
    return addresses.RESERVES.DAI;
  }

  if (bond === BONDS.dai_clam) {
    return addresses.RESERVES.DAI_CLAM;
  }

  throw Error(`Address for asset doesn't support: ${bond}`);
};
