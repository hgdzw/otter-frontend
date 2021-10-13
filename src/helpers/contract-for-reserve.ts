import { ethers } from 'ethers';
import { getAddresses, BONDS } from 'src/constants';
import { MimReserveContract, MimTimeReserveContract } from '../abi';

export const contractForReserve = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const addresses = getAddresses(networkID);
  if (bond === BONDS.dai) {
    return new ethers.Contract(addresses.RESERVES.DAI, MimReserveContract, provider);
  }

  if (bond === BONDS.dai_clam) {
    return new ethers.Contract(addresses.RESERVES.DAI_CLAM, MimTimeReserveContract, provider);
  }

  throw Error(`Contract for reserve doesn't support: ${bond}`);
};
