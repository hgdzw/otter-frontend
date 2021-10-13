import { ethers } from 'ethers';
import { getAddresses, BONDS } from 'src/constants';
import { MimReserveContract, MimTimeReserveContract } from '../abi';

export const contractForReserve = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const addresses = getAddresses(networkID);
  if (bond === BONDS.mim) {
    return new ethers.Contract(addresses.RESERVES.MIM, MimReserveContract, provider);
  }

  if (bond === BONDS.mim_time) {
    return new ethers.Contract(addresses.RESERVES.MIM_TIME, MimTimeReserveContract, provider);
  }

  throw Error(`Contract for reserve doesn't support: ${bond}`);
};
