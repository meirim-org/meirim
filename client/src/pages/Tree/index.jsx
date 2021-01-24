import React from 'react';
import PropTypes from 'prop-types';
import { useParams, Route, Switch } from 'react-router-dom';
import { withGetScreen } from 'react-getscreen';
import { useDataHandler } from './hooks';
import { SummaryTab } from 'pages/Tree/containers';
import TreeMobile from './mobile';
import TreeDesktop from './desktop';

const Tree = ({ isMobile, isTablet, match }) => {
	const { id: treeId } = useParams();
	useDataHandler(treeId);

	const treeProps = {
		match
	};
	
	// TODO mobile
	// const Template = isMobile() || isTablet() ? TreeMobile : TreeDesktop;

	const Template = TreeDesktop;
	return (
		<Template {...treeProps}>
			<Switch>
				<Route path={match.url + '/'} render={props => 
					<SummaryTab
						{...props}
					/>}	
				/>
			</Switch>	
		</Template>
	);
};

Tree.propTypes = {
	isMobile: PropTypes.func.isRequired,
	isTablet: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default withGetScreen(Tree, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });
