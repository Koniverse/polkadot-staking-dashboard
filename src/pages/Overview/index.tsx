// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import moment from 'moment';
import { StatBoxList } from 'library/StatBoxList';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubscan } from 'contexts/Subscan';
import { SubscanButton } from 'library/SubscanButton';
import { PageTitle } from 'library/PageTitle';
import { GRAPH_HEIGHT } from 'consts';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { planckBnToUnit, humanNumber } from 'Utils';
import { ActiveAccount } from './ActiveAccount';
import TotalNominatorsStatBox from './Stats/TotalNominators';
import SupplyStakedStatBox from './Stats/SupplyStaked';
import { ActiveNominatorsStatBox } from './Stats/ActiveNominators';
import Announcements from './Announcements';
import BalanceGraph from './BalanceGraph';
import Payouts from './Payouts';

export const Overview = () => {
  const { network } = useApi();
  const { units } = network;
  const { activeAccount } = useConnect();
  const { payouts, poolClaims } = useSubscan();

  const { payoutsByDay, poolClaimsByDay, lastReward } = formatRewardsForGraphs(
    21,
    units,
    payouts,
    poolClaims
  );

  return (
    <>
      <PageTitle title="Overview" />
      <StatBoxList>
        <SupplyStakedStatBox />
        <TotalNominatorsStatBox />
        <ActiveNominatorsStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper hOrder={0} vOrder={0}>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <ActiveAccount />
            <BalanceGraph />
          </GraphWrapper>
        </RowSecondaryWrapper>
        <RowPrimaryWrapper hOrder={1} vOrder={1}>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <SubscanButton />
            <div className="head">
              <h4>Recent Payouts</h4>
              <h2>
                {lastReward === null
                  ? 0
                  : humanNumber(
                      planckBnToUnit(new BN(lastReward.amount), units)
                    )}
                &nbsp;{network.unit}
                &nbsp;
                <span className="fiat">
                  {lastReward === null
                    ? ''
                    : moment.unix(lastReward.block_timestamp).fromNow()}
                </span>
              </h2>
            </div>
            <Payouts
              account={activeAccount}
              payoutsByDay={payoutsByDay}
              poolClaimsByDay={poolClaimsByDay}
            />
          </GraphWrapper>
        </RowPrimaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <Announcements />
      </PageRowWrapper>
    </>
  );
};

export default Overview;
