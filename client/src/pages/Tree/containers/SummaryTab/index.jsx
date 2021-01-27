import React, { useEffect } from 'react';
import { TreeSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import { WeNeedYou } from 'shared';
import { TreeDetailsPanel,  MapPanel, TreeReasonPanel, TreeAppealPanel } from 'pages/Tree/common';
import { withGetScreen } from 'react-getscreen';
import { scrollToTop } from 'utils';

const SummaryTab = ({  isMobile, isTablet }) => {
	const { treeData } = TreeSelectors();
	const { geom, place } = treeData;
	useEffect(() => {
		scrollToTop();
	}, []);

	return (
		<>
			<TreeDetailsPanel/>
			{isMobile() || isTablet()
				?
				<MapPanel geom={geom} countyName={place}/>
				:
				null
			}
			<TreeReasonPanel/>
			<TreeAppealPanel/>
			<WeNeedYou/>
		</>
	);
};

SummaryTab.propTypes = {
	isMobile:PropTypes.func.isRequired,
	isTablet:PropTypes.func.isRequired
};

export default withGetScreen(SummaryTab, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });
