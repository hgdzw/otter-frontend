import { ethers } from 'ethers';
import { BONDS, getAddresses } from '../../constants';
import { MimTokenContract, TimeTokenContract, MemoTokenContract } from '../../abi/';
import { contractForBond, contractForReserve, setAll } from '../../helpers';

import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

interface IAccountProps {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

interface IUserBindDetails {
  bond?: string;
  allowance?: number;
  balance?: number;
  interestDue?: number;
  bondMaturationTime?: number;
  pendingPayout?: number;
}

export interface IAccount {
  balances: {
    mai: string;
    sClam: string;
    clam: string;
  };
  staking: {
    clamStake: number;
    sClamUnstake: number;
  };
}

export const getBalances = createAsyncThunk(
  'account/getBalances',
  async ({ address, networkID, provider }: IAccountProps) => {
    const addresses = getAddresses(networkID);
    const sClamContract = new ethers.Contract(addresses.sCLAM_ADDRESS, MemoTokenContract, provider);
    const sClamBalance = await sClamContract.balanceOf(address);
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, TimeTokenContract, provider);
    const clamBalance = await clamContract.balanceOf(address);
    return {
      balances: {
        sClam: ethers.utils.formatUnits(sClamBalance, 'gwei'),
        clam: ethers.utils.formatUnits(clamBalance, 'gwei'),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({ networkID, provider, address }: IAccountProps): Promise<IAccount> => {
    let clamBalance = 0;
    let sClamBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    const maiContract = new ethers.Contract(addresses.MAI_ADDRESS, MimTokenContract, provider);
    const maiBalance = await maiContract.balanceOf(address);

    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, TimeTokenContract, provider);
    clamBalance = await clamContract.balanceOf(address);
    stakeAllowance = await clamContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);

    const sClamContract = new ethers.Contract(addresses.sCLAM_ADDRESS, MemoTokenContract, provider);
    sClamBalance = await sClamContract.balanceOf(address);
    unstakeAllowance = await sClamContract.allowance(address, addresses.STAKING_ADDRESS);

    return {
      balances: {
        sClam: ethers.utils.formatUnits(sClamBalance, 'gwei'),
        clam: ethers.utils.formatUnits(clamBalance, 'gwei'),
        mai: ethers.utils.formatEther(maiBalance),
      },
      staking: {
        clamStake: +stakeAllowance,
        sClamUnstake: +unstakeAllowance,
      },
    };
  },
);

interface ICalculateUserBondDetails {
  address: string;
  bond: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const calculateUserBondDetails = createAsyncThunk(
  'bonding/calculateUserBondDetails',
  async ({ address, bond, networkID, provider }: ICalculateUserBondDetails): Promise<IUserBindDetails> => {
    if (!address) return {};

    const addresses = getAddresses(networkID);
    const bondContract = contractForBond(bond, networkID, provider);
    const reserveContract = contractForReserve(bond, networkID, provider);

    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTime;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = '0';

    if (bond === BONDS.mai) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    }

    if (bond === BONDS.mai_clam) {
      allowance = await reserveContract.allowance(address, addresses.BONDS.MAI_CLAM);
      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, 'ether');
    }

    return {
      bond,
      allowance: Number(allowance),
      balance: Number(balance),
      interestDue,
      bondMaturationTime,
      pendingPayout: Number(ethers.utils.formatUnits(pendingPayout, 'gwei')),
    };
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.status = 'loading';
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.status = 'idle';
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        //@ts-ignore
        const bond = action.payload.bond!;
        state[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: { account: IAccount }) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
