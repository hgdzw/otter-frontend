import { SvgIcon } from '@material-ui/core';
import { ReactComponent as MimSvg } from '../assets/tokens/MIM.svg';
import { ReactComponent as TimeSvg } from '../assets/tokens/TIME.svg';

function getMimTokenImage() {
  return <SvgIcon component={MimSvg} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />;
}

function getTimeTokenImage() {
  return <SvgIcon component={TimeSvg} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />;
}

export function getTokenImage(name: string): JSX.Element {
  if (name === 'mim') return getMimTokenImage();
  if (name === 'time') return getTimeTokenImage();

  throw Error(`Token image doesn't support: ${name}`);
}

function toUrl(base: string): string {
  const url = window.location.origin;
  return url + base;
}

export function getTokenUrl(name: string) {
  if (name === 'time') {
    const path = require('../assets/tokens/TIME.svg').default;
    return toUrl(path);
  }

  if (name === 'memo') {
    const path = require('../assets/tokens/MEMO.png').default;
    return toUrl(path);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
