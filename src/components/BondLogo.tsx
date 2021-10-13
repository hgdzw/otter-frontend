import { isBondLP, getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';

interface IBondHeaderProps {
  bond: string;
}

function BondHeader({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.indexOf('time') >= 0) {
      return getTokenImage('time');
    } else if (bond.indexOf('mim') >= 0) {
      return getTokenImage('mim');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={'64px'}>
      {isBondLP(bond) ? getPairImage(bond) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
