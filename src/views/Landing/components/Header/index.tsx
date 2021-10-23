import { useState } from 'react';
import './header.scss';
import { Link } from '@material-ui/core';
import HeaderLogo from './header-logo.png';
import { DiscordLink, DocsLink, GithubLink, TwitterLink } from 'src/constants';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="landing-header">
      <div className="landing-header-logo">
        <img src={HeaderLogo} alt="logo" style={{ width: '177px', height: '40px' }} />
      </div>
      <Link href={TwitterLink}>Twitter</Link>
      <Link href={DiscordLink}>Discord</Link>
      <Link href={GithubLink}>Github</Link>
      {/* <Link href={DocsLink}>Docs</Link> */}
      {/* <div className="landing-header-nav-wrap">
        <Box
          component="div"
          onMouseEnter={e => handleClick(e)}
          onMouseLeave={e => handleClick(e)}
          id="ohm-menu-button-hover"
        >
          <p className="landing-header-nav-text">Social</p>
          <Popper className="landing-header-poper" open={open} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <div className="tooltip">
                  <Link
                    className="tooltip-item"
                    href="https://github.com/Abracadabra-money/wonderland-frontend"
                    target="_blank"
                  >
                    <SvgIcon color="primary" component={GitHub} />
                    <p>GitHub</p>
                  </Link>
                  <Link className="tooltip-item" href="https://twitter.com/wonderland_fi?s=21" target="_blank">
                    <SvgIcon color="primary" component={Twitter} />
                    <p>Twitter</p>
                  </Link>
                  <Link className="tooltip-item" href="https://t.me/joinchat/6UybL5rJMEhjN2Y5" target="_blank">
                    <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
                    <p>Telegram</p>
                  </Link>
                </div>
              </Fade>
            )}
          </Popper>
        </Box>
      </div> */}
    </div>
  );
}

export default Header;
