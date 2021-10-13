import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../../constants';
import { StakingContract, MemoTokenContract, BondingCalcContract } from '../../abi';
import { addressForAsset, contractForReserve, setAll } from '../../helpers';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getMarketPrice, getTokenPrice } from '../../helpers';

const initialState = {
  loading: true,
};

export interface IApp {
  loading: boolean;
  stakingTVL: number;
  marketPrice: number;
  marketCap: number;
  circSupply: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  treasuryBalance: number;
  stakingAPY: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
}

interface ILoadAppDetails {
  networkID: number;
  provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
  'app/loadAppDetails',
  //@ts-ignore
  async ({ networkID, provider }: ILoadAppDetails) => {
    const mimPrice = await getTokenPrice('MIM');

    const stakingTVL = 0;

    const addresses = getAddresses(networkID);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
    const bondCalculator = new ethers.Contract(addresses.TIME_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
    let token = contractForReserve(BONDS.mim, networkID, provider);
    const mimAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);

    token = contractForReserve(BONDS.mim_time, networkID, provider);
    const mimTimeAmount = await token.balanceOf(addresses.TREASURY_ADDRESS);
    const valuation = await bondCalculator.valuation(addressForAsset(BONDS.mim_time, networkID), mimTimeAmount);
    const markdown = await bondCalculator.markdown(addressForAsset(BONDS.mim_time, networkID));
    let mimTimeUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    const treasuryBalance = mimAmount / Math.pow(10, 18) + mimTimeUSD;

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await memoContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endBlock.toNumber();

    const marketPrice = await getMarketPrice(networkID, provider);

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
      currentBlock,
      fiveDayRate,
      treasuryBalance,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketPrice: (marketPrice / Math.pow(10, 9)) * mimPrice,
      currentBlockTime,
      nextRebase,
    };
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { app: IApp }) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
