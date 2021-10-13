import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (daiBondDiscount?: string | number, daiClamBondDiscount?: string | number) => {
  return [
    {
      name: 'DAI',
      value: 'dai',
      discount: Number(daiBondDiscount),
    },
    {
      name: 'CLAM-DAI LP',
      value: 'dai_clam_lp',
      discount: Number(daiClamBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const daiBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['dai'] && state.bonding['dai'].bondDiscount;
  });

  const daiClamDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['dai_clam_lp'] && state.bonding['dai_clam_lp'].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(daiBondDiscount, daiClamDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [daiBondDiscount, daiClamDiscount]);

  return bonds;
};
