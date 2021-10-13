import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (mimBondDiscount?: string | number, mimTimeBondDiscount?: string | number) => {
  return [
    {
      name: 'MIM',
      value: 'mim',
      discount: Number(mimBondDiscount),
    },
    {
      name: 'TIME-MIM LP',
      value: 'mim_time_lp',
      discount: Number(mimTimeBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const mimBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['mim'] && state.bonding['mim'].bondDiscount;
  });

  const mimTimeDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['mim_time_lp'] && state.bonding['mim_time_lp'].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(mimBondDiscount, mimTimeDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [mimBondDiscount, mimTimeDiscount]);

  return bonds;
};
