import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './slices/account-slice';
import bondingReducer from './slices/bond-slice';
import appReducer from './slices/app-slice';
import pendingTransactionsReducer from './slices/pending-txns-slice';
import whitelistReducer from './slices/whitelist-slice';

const store = configureStore({
  reducer: {
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    whitelist: whitelistReducer,
  },
});

export default store;
