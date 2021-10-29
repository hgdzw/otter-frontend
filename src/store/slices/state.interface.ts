import { IPendingTxn } from './pending-txns-slice';
import { IAccount } from './account-slice';
import { IApp } from './app-slice';
import { IBond } from './bond-slice';
import { IIDO } from './ido-slice';

export interface IReduxState {
  pendingTransactions: IPendingTxn[];
  account: IAccount;
  app: IApp;
  bonding: IBond;
  ido: IIDO;
}
