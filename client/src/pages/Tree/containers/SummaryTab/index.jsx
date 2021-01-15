import React, { useEffect } from 'react';
import { TreeSelectors } from 'redux/selectors';
import PropTypes from 'prop-types';
import { TreeDetailsPanel,  MapPanel, TreeReasonPanel } from 'pages/Tree/common';
import { withGetScreen } from 'react-getscreen';
import { scrollToTop } from 'utils';

const SummaryTab = ({  isMobile, isTablet }) => {
	const { treeData } = TreeSelectors();
	const { geom, place , street, street_number, action } = treeData;
	useEffect(() => {
		scrollToTop();
	}, []);

	return (
		<>
			<TreeDetailsPanel/>
			<TreeReasonPanel/>
		
			{isMobile() || isTablet()
				?
				<MapPanel geom={geom} countyName={place}/>
				:
				null
			}
		</>
	);
};

SummaryTab.propTypes = {
	isMobile:PropTypes.func.isRequired,
	isTablet:PropTypes.func.isRequired,
	// subscribePanel: PropTypes.bool.isRequired,
	// handleSubscribePanel: PropTypes.func.isRequired,
};

export default withGetScreen(SummaryTab, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });

