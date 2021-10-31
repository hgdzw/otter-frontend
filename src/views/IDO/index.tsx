import { useDispatch } from 'react-redux';
import { Button, Link } from '@material-ui/core';
import LandingHeader from 'src/components/LandingHeader';
import { useWeb3Context } from 'src/hooks';
import styles from './ido.module.scss';
import happyOtter from '../IDO/images/otter_happy.png';
import polygon from '../IDO/images/polygon.svg';
import { DiscordLink, TwitterLink, MediumLink, GithubLink } from '../../constants';
import Footer from '../Landing/components/Footer';
import Countdown from '../Landing/components/Countdown';

export default function IDO() {
  const dispatch = useDispatch();
  const { address, connect, connected, provider, chainID } = useWeb3Context();
  return (
    <div>
      <div className={styles.body}>
        <LandingHeader />
        <h1 className={styles.title}>Claim your CLAM</h1>
        <p className={styles.desc}>
          The IDO will be held from Nov 1, 2021 0:00 UTC to Nov 2, 2021 23:59 UTC. Join the Otter`s Kingdom now!🦦
        </p>

        <div className={styles.mainBox}>
          <div className={styles.happyOtterBox}>
            <img src={happyOtter} className={styles.happyOtter} />
          </div>

          <div className={styles.currentMaiBox}>
            {/* <img src={polygon} className={styles.polygon} /> */}
            <h1>Current Amount (MAI)</h1>
            <h2>$0</h2>
          </div>
        </div>

        {Date.now() > 1635724800000 && (
          <div className={styles.claimClamBox}>
            <p className={styles.title}>
              Claim your <span className={styles.highlight}>CLAM</span> to join the Otter Kingdom now!
            </p>
            <div className={styles.web3Box}>
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
          </div>
        )}
        <div>
          <p className={styles.learnMore}>
            <a href={MediumLink}>Learn more</a>
          </p>
        </div>

        <div className={styles.countdownBox}>
          <p className={styles.countdownTitle}>IDO After</p>
          <Countdown />
        </div>
      </div>
      <Footer />
    </div>
  );
}
