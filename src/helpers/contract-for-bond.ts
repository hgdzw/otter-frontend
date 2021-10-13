import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../constants';
import { MimBondContract, MimTimeBondContract } from '../abi';

export const contractForBond = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
): ethers.Contract => {
  const addresses = getAddresses(networkID);

  if (bond === BONDS.mim) {
    return new ethers.Contract(addresses.BONDS.MIM, MimBondContract, provider);
  }

  if (bond === BONDS.mim_time) {
    return new ethers.Contract(addresses.BONDS.MIM_TIME, MimTimeBondContract, provider);
  }

  throw Error(`Contract for bond doesn't support: ${bond}`);
};
