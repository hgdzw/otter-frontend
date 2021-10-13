import React, { useState } from 'react';
import './header.scss';
import { ReactComponent as WonderlandIcon } from '../../../../assets/icons/wonderland-nav-header.svg';
import { SvgIcon, Link, Box, Popper, Fade } from '@material-ui/core';
import { ReactComponent as GitHub } from '../../../../assets/icons/github.svg';
import { ReactComponent as Twitter } from '../../../../assets/icons/twitter.svg';
import { ReactComponent as Telegram } from '../../../../assets/icons/telegram.svg';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="landing-header">
      <SvgIcon
        color="primary"
        component={WonderlandIcon}
        viewBox="0 0 130 60"
        //@ts-ignore
        style={{ minWdth: '130px', minHeight: '56px', width: '130px' }}
      />
      <div className="landing-header-nav-wrap">
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
      </div>
    </div>
  );
}

export default Header;
