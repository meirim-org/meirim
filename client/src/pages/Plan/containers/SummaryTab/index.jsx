import React from 'react';
import { PlanSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import {
    GoalsPanel,
    DetailsPanel,
    StatsPanel,
    HousingUnitPanel,
    SubscribePanel,
    MapPanel,
} from 'pages/Plan/common';
import { withGetScreen } from 'react-getscreen';
import { useScrollToTop } from '../../hooks';
import LinksPanel from '../../common/Panels/links';

const SummaryTab = ({
    subscribePanel,
    handleSubscribePanel,
    isMobile,
    isTablet,
}) => {
    const { planData, dataArea, dataUnits, textArea } = PlanSelectors();
    const { type, status, lastUpdate, url, goalsFromMavat, countyName } =
        planData;
    useScrollToTop();

    return (
        <>
            <DetailsPanel
                type={type}
                status={status}
                lastUpdate={lastUpdate}
                url={url}
            />
            <GoalsPanel goalsFromMavat={goalsFromMavat} />
            {isMobile() || isTablet() ? (
                <MapPanel geom={planData.geom} countyName={countyName} />
            ) : null}
            <LinksPanel />
            <StatsPanel dataArea={dataArea} textArea={textArea} />
            <HousingUnitPanel dataUnits={dataUnits} />
            <SubscribePanel
                subscribePanel={subscribePanel}
                handleSubscribePanel={handleSubscribePanel}
            />
        </>
    );
};

SummaryTab.propTypes = {
    isMobile: PropTypes.func.isRequired,
    isTablet: PropTypes.func.isRequired,
    subscribePanel: PropTypes.bool.isRequired,
    handleSubscribePanel: PropTypes.func.isRequired,
};

export default withGetScreen(SummaryTab, {
    mobileLimit: 768,
    tabletLimit: 1024,
    shouldListenOnResize: true,
});
