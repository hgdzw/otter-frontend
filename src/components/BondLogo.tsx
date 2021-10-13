import { isBondLP, getTokenImage, getPairImage } from '../helpers';
import { Box } from '@material-ui/core';

interface IBondHeaderProps {
  bond: string;
}

function BondHeader({ bond }: IBondHeaderProps) {
  const reserveAssetImg = () => {
    if (bond.indexOf('clam') >= 0) {
      return getTokenImage('clam');
    } else if (bond.indexOf('dai') >= 0) {
      return getTokenImage('dai');
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={'64px'}>
      {isBondLP(bond) ? getPairImage(bond) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
