// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';
import { toFixedIfNecessary } from 'Utils';

export const ActiveNominatorsStatBox = () => {
  const { consts } = useApi();
  const { maxElectingVoters } = consts;
  const { eraStakers } = useStaking();
  const { totalActiveNominators } = eraStakers;
  const { t } = useTranslation('pages');

  // active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxElectingVoters > 0) {
    totalNominatorsAsPercent =
      totalActiveNominators /
      new BigNumber(maxElectingVoters).dividedBy(new BigNumber(100)).toNumber();
  }

  const params = {
    label: t('overview.activeNominators'),
    stat: {
      value: totalActiveNominators,
      total: maxElectingVoters,
      unit: '',
    },
    graph: {
      value1: totalActiveNominators,
      value2: maxElectingVoters - totalActiveNominators,
    },
    tooltip: `${toFixedIfNecessary(totalNominatorsAsPercent, 2)}%`,
    helpKey: 'Active Nominators',
  };

  return <Pie {...params} />;
};

export default ActiveNominatorsStatBox;
