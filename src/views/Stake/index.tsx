import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Box,
  Paper,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tab,
  Tabs,
  Zoom,
} from '@material-ui/core';
import RebaseTimer from '../../components/RebaseTimer/RebaseTimer';
import TabPanel from '../../components/TabPanel';
import { trim } from '../../helpers';
import { changeStake, changeApproval } from '../../store/slices/stake-thunk';
import './stake.scss';
import { useWeb3Context } from '../../hooks';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connect, chainID } = useWeb3Context();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>();

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const currentIndex = useSelector<IReduxState, string>(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector<IReduxState, number>(state => {
    return state.app.fiveDayRate;
  });
  const clamBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.clam;
  });
  const sClamBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.sClam;
  });
  const stakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.clamStake;
  });
  const unstakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.sClamUnstake;
  });
  const stakingRebase = useSelector<IReduxState, number>(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector<IReduxState, number>(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(clamBalance);
    } else {
      setQuantity(sClamBalance);
    }
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    //@ts-ignore
    if (isNaN(quantity) || quantity === 0 || quantity === '') {
      // eslint-disable-next-line no-alert
      alert('Please enter a value!');
    } else {
      await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === 'CLAM') return stakeAllowance > 0;
      if (token === 'sCLAM') return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance],
  );

  const changeView = (event: any, newView: number) => {
    setView(newView);
  };

  const trimmedSClamBalance = trim(Number(sClamBalance), 4);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedSClamBalance), 4);

  return (
    <div id="stake-view">
      <Zoom in={true}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <p className="single-stake-title">
                  CLAM Staking ({String.fromCodePoint(0x1f9a6)}, {String.fromCodePoint(0x1f9a6)})
                </p>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <p className="single-stake-subtitle">APY</p>
                      <p className="single-stake-subtitle-value">
                        {stakingAPY ? (
                          new Intl.NumberFormat('en-US', {
                            style: 'percent',
                            notation: stakingAPY > 100000 ? 'engineering' : 'standard',
                          }).format(stakingAPY)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <p className="single-stake-subtitle">TVL</p>
                      <p className="single-stake-subtitle-value">
                        {stakingTVL ? (
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <p className="single-stake-subtitle">Current Index</p>
                      <p className="single-stake-subtitle-value">
                        {currentIndex ? <>{trim(Number(currentIndex), 1)} CLAM</> : <Skeleton width="150px" />}
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <div className="form-connect-btn" onClick={connect}>
                      <p>Connect Wallet</p>
                    </div>
                  </div>
                  <p className="desc-text">Connect your wallet to stake CLAM tokens!</p>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Unstake" {...a11yProps(0)} />
                    </Tabs>

                    <Box className="stake-action-row" display="flex" alignItems="center">
                      <FormControl className="ohm-input" variant="outlined" color="primary">
                        <InputLabel htmlFor="amount-input"></InputLabel>
                        <OutlinedInput
                          id="amount-input"
                          type="number"
                          placeholder="Amount"
                          className="stake-input"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div onClick={setMax} className="stake-input-btn">
                                <p>Max</p>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </FormControl>

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {address && hasAllowance('CLAM') ? (
                          <div
                            className="stake-tab-panel-btn"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, 'staking')) return;
                              onChangeStake('stake');
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, 'staking', 'Stake CLAM')}</p>
                          </div>
                        ) : (
                          <div
                            className="stake-tab-panel-btn"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, 'approve_staking')) return;
                              onSeekApproval('CLAM');
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, 'approve_staking', 'Approve')}</p>
                          </div>
                        )}
                      </TabPanel>

                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {address && hasAllowance('sCLAM') ? (
                          <div
                            className="stake-tab-panel-btn"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, 'unstaking')) return;
                              onChangeStake('unstake');
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, 'unstaking', 'Unstake CLAM')}</p>
                          </div>
                        ) : (
                          <div
                            className="stake-tab-panel-btn"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, 'approve_unstaking')) return;
                              onSeekApproval('sCLAM');
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, 'approve_unstaking', 'Approve')}</p>
                          </div>
                        )}
                      </TabPanel>
                    </Box>

                    <div className="help-text">
                      {address && ((!hasAllowance('CLAM') && view === 0) || (!hasAllowance('sCLAM') && view === 1)) && (
                        <p className="text-desc">
                          Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                          subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                          transaction.
                        </p>
                      )}
                    </div>
                  </Box>

                  <div className={`stake-user-data`}>
                    <div className="data-row">
                      <p className="data-row-name">Your Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(clamBalance), 4)} CLAM</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Your Staked Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? (
                          <Skeleton width="80px" />
                        ) : (
                          <>{new Intl.NumberFormat('en-US').format(Number(trimmedSClamBalance))} sCLAM</>
                        )}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Amount</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} sCLAM</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Yield</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">ROI (5-Day Rate)</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Stake;
