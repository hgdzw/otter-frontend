import './landing.scss';
import Header from './components/Header';
import Stat from './components/Stat';
import { Link, Paper } from '@material-ui/core';
import Shell from './shell.png';
import LeftMountain from './left_mountain.png';
import RightMountain from './right_mountain.png';
import SecondSection from './components/SecondSection';
import Footer from './components/Footer';
import { DiscordLink, GithubLink, TwitterLink } from 'src/constants';
import TwitterIcon from './images/twitter.svg';
import DiscordIcon from './images/icon_discord.svg';
import GithubIcon from './images/icon_github.svg';
import Otter01 from './images/otter_01.png';

function Landing() {
  return (
    <div className="landing">
      <Header />
      <section className="landing__first-section">
        <div className="landing__first-section__title">
          <h1>
            Otter<span style={{ color: '#FF6854' }}>C</span>lam
          </h1>
        </div>
        <div className="landing__first-section__subtitle">
          <p>Wen (3,3) becomes (🦦,🦦)</p>
        </div>
        <div className="landing__first-section__body">
          <div className="landing__first-section__body__left">
            <div className="landing__first-section__body__title">
              <p>The Decentralized</p>
              <p>Reversed Memecoin</p>
            </div>
            <div className="landing__first-section__body__subtitle">
              <p>The first store of value meme</p>
            </div>
            <div className="community-icons">
              <Link href={TwitterLink} className="community-icon-link">
                <img src={TwitterIcon} />
              </Link>
              <Link href={DiscordLink} className="community-icon-link">
                <img src={DiscordIcon} />
              </Link>
              <Link href={GithubLink} className="community-icon-link">
                <img src={GithubIcon} />
              </Link>
            </div>
          </div>
          <div className="otter01">
            <img src={Otter01} alt="otter01" />
          </div>
        </div>
        <div className="landing__first-section__footer">
          <img className="landing__first-section__footer__shell" src={Shell} alt="shell" />
          <div className="landing__first-section__footer__wave" />
          <img className="landing__first-section__footer__left-mountain" src={LeftMountain} alt="mountain" />
          <img className="landing__first-section__footer__right-mountain" src={RightMountain} alt="mountain" />
          <div className="landing__first-section__footer__banner">IDO Soon~</div>
        </div>
      </section>
      <Stat />
      <SecondSection />
      <Footer />
    </div>
  );
}

export default Landing;
