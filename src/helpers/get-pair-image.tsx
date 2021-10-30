import { SvgIcon } from '@material-ui/core';
import { ReactComponent as TimeMimSvg } from '../assets/tokens/TIME-MIM.svg';

export function getPairImage(name: string): JSX.Element {
  if (name.indexOf('mai') >= 0)
    return <SvgIcon component={TimeMimSvg} viewBox="0 0 62 32" style={{ height: '30px', width: '62px' }} />;

  throw Error(`Pair image doesn't support: ${name}`);
}
