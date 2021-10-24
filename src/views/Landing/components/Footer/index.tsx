import { Link } from '@material-ui/core';
import { DiscordLink, DocsLink, GithubLink, TwitterLink } from 'src/constants';
import styles from './footer.module.scss';
import TwitterIcon from '../../images/twitter.svg';
import DiscordIcon from '../../images/icon_discord.svg';
import GithubIcon from '../../images/icon_github.svg';
import HeaderLogo from '../Header/header-logo.png';
import PolygonLogo from './polygon-logo.png';
import XIcon from './x-icon.svg';

interface LinkButtonProps {
  name: string;
  href: string;
  image: any;
}

function LinkButton({ name, href, image }: LinkButtonProps) {
  return (
    <Link className={styles.linkButton} href={href}>
      <img className={styles.linkImage} src={image} alt={name} />
      <p>{name}</p>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>Join Our Community</h2>
      <div className={styles.buttonList}>
        <LinkButton name="Twitter" href={TwitterLink} image={TwitterIcon} />
        <LinkButton name="Discord" href={DiscordLink} image={DiscordIcon} />
        <LinkButton name="Github" href={GithubLink} image={GithubIcon} />
        {/* <LinkButton name="Docs" href={DocsLink} image={TwitterIcon} /> */}
      </div>
      <p className={styles.makeit}>Let's make it (🦦,🦦)</p>
      <div className={styles.logos}>
        <img src={HeaderLogo} alt="logo" />
        <img src={XIcon} alt="x" style={{ width: 20, height: 20 }} />
        <img src={PolygonLogo} alt="logo" />
      </div>
    </footer>
  );
}
