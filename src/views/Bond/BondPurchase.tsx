import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, InputLabel, OutlinedInput, InputAdornment, Slide, FormControl } from '@material-ui/core';
import { shorten, trim, prettifySeconds } from '../../helpers';
import { changeApproval, bondAsset, calcBondDetails } from '../../store/slices/bond-slice';
import { useWeb3Context } from '../../hooks';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';
import { BLOCK_RATE_SECONDS } from 'src/constants';

interface IBondPurchaseProps {
  bond: string;
  slippage: number;
}

function BondPurchase({ bond, slippage }: IBondPurchaseProps) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [recipientAddress, setRecipientAddress] = useState(address);
  const [quantity, setQuantity] = useState('');

  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const vestingTerm = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].vestingTerm;
  });

  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const maxBondPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].maxBondPrice;
  });
  const interestDue = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].interestDue;
  });
  const pendingPayout = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].pendingPayout;
  });
  const debtRatio = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].debtRatio;
  });
  const bondQuote = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondQuote;
  });
  const balance = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].balance;
  });
  const allowance = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].allowance;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    // return prettifySeconds(vestingTerm, "day");
    const time = vestingTerm * BLOCK_RATE_SECONDS;
    return prettifySeconds(time, 'seconds');
  };

  async function onBond() {
    if (quantity === '') {
      alert('Please enter a value!');
      //@ts-ignore
    } else if (isNaN(quantity)) {
      alert('Please enter a valid value!');
    } else if (interestDue > 0 || pendingPayout > 0) {
      const shouldProceed = window.confirm(
        'You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?',
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
          }),
        );
      }
    } else {
      await dispatch(
        //@ts-ignore
        bondAsset({
          value: quantity,
          slippage,
          bond,
          networkID: chainID,
          provider,
          address: recipientAddress || address,
        }),
      );
    }
  }

  const hasAllowance = useCallback(() => {
    return allowance > 0;
  }, [allowance]);

  const setMax = () => {
    setQuantity((balance || '').toString());
  };

  const balanceUnits = () => {
    if (bond.indexOf('_lp') >= 0) return 'LP';
    else return 'MIM';
  };

  async function loadBondDetails() {
    if (provider) await dispatch(calcBondDetails({ bond, value: quantity, provider, networkID: chainID }));
  }

  useEffect(() => {
    loadBondDetails();
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const onSeekApproval = async () => {
    await dispatch(changeApproval({ bond, provider, networkID: chainID, address }));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
          <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
          <OutlinedInput
            placeholder="Amount"
            id="outlined-adornment-amount"
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            labelWidth={0}
            className="bond-input"
            endAdornment={
              <InputAdornment position="end">
                <div className="stake-input-btn" onClick={setMax}>
                  <p>Max</p>
                </div>
              </InputAdornment>
            }
          />
        </FormControl>
        {hasAllowance() ? (
          <div
            className="transaction-button bond-approve-btn"
            onClick={async () => {
              if (isPendingTxn(pendingTransactions, 'bond_' + bond)) return;
              await onBond();
            }}
          >
            <p>{txnButtonText(pendingTransactions, 'bond_' + bond, 'Bond')}</p>
          </div>
        ) : (
          <div
            className="transaction-button bond-approve-btn"
            onClick={async () => {
              if (isPendingTxn(pendingTransactions, 'approve_' + bond)) return;
              await onSeekApproval();
            }}
          >
            <p>{txnButtonText(pendingTransactions, 'approve_' + bond, 'Approve')}</p>
          </div>
        )}

        {!hasAllowance() && (
          <div className="help-text">
            <p className="help-text-desc">
              Note: The "Approve" transaction is only needed when bonding for the first time; subsequent bonding only
              requires you to perform the "Bond" transaction.
            </p>
          </div>
        )}
      </Box>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <p className="bond-balance-title">Your Balance</p>
            <p className="bond-balance-title">
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                <>
                  {trim(balance, 4)} {balanceUnits()}
                </>
              )}
            </p>
          </div>

          <div className={`data-row`}>
            <p className="bond-balance-title">You Will Get</p>
            <p className="price-data bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondQuote, 4) || '0'} TIME`}
            </p>
          </div>

          <div className={`data-row`}>
            <p className="bond-balance-title">Max You Can Buy</p>
            <p className="price-data bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(maxBondPrice, 4) || '0'} TIME`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">ROI</p>
            <p className="bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondDiscount * 100, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">Debt Ratio</p>
            <p className="bond-balance-title">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio / 10000000, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">Vesting Term</p>
            <p className="bond-balance-title">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
          </div>

          {recipientAddress !== address && (
            <div className="data-row">
              <p className="bond-balance-title">Recipient</p>
              <p className="bond-balance-title">
                {isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}
              </p>
            </div>
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
