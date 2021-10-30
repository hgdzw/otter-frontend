import { useDispatch } from 'react-redux';
import { Button, Link } from '@material-ui/core';
import LandingHeader from 'src/components/LandingHeader';
import { useWeb3Context } from 'src/hooks';
import styles from './ido.module.scss';

export default function IDO() {
  const dispatch = useDispatch();
  const { address, connect, connected, provider, chainID } = useWeb3Context();
  return (
    <div className={styles.body}>
      <LandingHeader />
      <h1 className={styles.title}>Claim your CLAM</h1>
      <p className={styles.desc}>
        The IDO will be held from Nov 1, 2021 0:00 UTC to Nov 2, 2021 23:59 UTC. Join the Otter`s Kingdom now!🦦
      </p>
      {connected ? (
        <div>Connected</div>
      ) : (
        <div className={styles.button}>
          <Button variant="contained" color="primary" size="large" disableElevation onClick={connect}>
            Connect Your Wallet
          </Button>
        </div>
      )}
    </div>
  );
}
