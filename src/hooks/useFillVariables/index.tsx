// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, planckToUnit } from '@polkadot-cloud/utils';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import type { AnyJson } from 'types';
import { useErasPerDay } from '../useErasPerDay';

export const useFillVariables = () => {
  const {
    consts,
    networkMetrics: { minimumActiveStake },
    poolsConfig: { minJoinBond, minCreateBond },
  } = useApi();
  const { networkData } = useNetwork();
  const { maxNominations, maxExposurePageSize, existentialDeposit } = consts;
  const { maxSupportedDays } = useErasPerDay();

  const fillVariables = (d: AnyJson, keys: string[]) => {
    const fields: AnyJson = Object.entries(d).filter(([k]) => keys.includes(k));
    const transformed = Object.entries(fields).map(
      ([, [key, val]]: AnyJson) => {
        const varsToValues = [
          ['{AVERAGE_REWARD_RATE_DAYS}', maxSupportedDays > 30 ? '30' : '15'],
          ['{NETWORK_UNIT}', networkData.unit],
          ['{NETWORK_NAME}', capitalizeFirstLetter(networkData.name)],
          ['{MAX_EXPOSURE_PAGE_SIZE}', maxExposurePageSize.toString()],
          ['{MAX_NOMINATIONS}', maxNominations.toString()],
          [
            '{MIN_ACTIVE_STAKE}',
            planckToUnit(minimumActiveStake, networkData.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_JOIN_BOND}',
            planckToUnit(minJoinBond, networkData.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            planckToUnit(minCreateBond, networkData.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{EXISTENTIAL_DEPOSIT}',
            planckToUnit(existentialDeposit, networkData.units).toFormat(),
          ],
        ];

        for (const varToVal of varsToValues) {
          if (val.constructor === Array) {
            val = val.map((_d) => _d.replaceAll(varToVal[0], varToVal[1]));
          } else {
            val = val.replaceAll(varToVal[0], varToVal[1]);
          }
        }
        return [key, val];
      }
    );

    return {
      ...d,
      ...Object.fromEntries(transformed),
    };
  };

  return {
    fillVariables,
  };
};
