import { ethers } from 'ethers';
import { getAddresses, BONDS } from '../../constants';
import { IDOContract } from '../../abi';
import { setAll } from '../../helpers';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { JsonRpcProvider } from '@ethersproject/providers';
import axios from 'axios';

const initialState = {
  loading: true,
};

export interface IIDO {
  loading: boolean;
  whitelisted: boolean;
}

interface ICheckIDOWhitelist {
  walletAddress: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const checkIDOWhiteList = createAsyncThunk(
  'ido/check-whitelist',
  //@ts-ignore
  async ({ walletAddress, networkID, provider }: ICheckIDOWhitelist) => {
    // const addresses = getAddresses(networkID);
    // const ido = new ethers.Contract(addresses.IDO, IDOContract, provider);
    // const whitelisted = await ido.whiteListed(walletAddress);
    try {
      const whitelisted = await axios.get(
        'https://us-central1-assetflow-dev.cloudfunctions.net/checkWhiteList?wallet=' + walletAddress,
      );

      return {
        whitelisted,
        loading: false,
      };
    } catch (error) {
      return {
        whitelisted: false,
        loading: false,
      };
    }
  },
);

const idoSlice = createSlice({
  name: 'ido',
  initialState,
  reducers: {
    fetchIDOSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkIDOWhiteList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(checkIDOWhiteList.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(checkIDOWhiteList.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: { ido: IIDO }) => state.ido;

export default idoSlice.reducer;

export const { fetchIDOSuccess } = idoSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
