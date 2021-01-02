import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Mapa from 'components/Mapa';
import Wrapper from 'components/Wrapper';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Header, SummaryTab, CommentsTab } from './containers';
import * as SC from './style';
import Template from './template.jsx';

const PlanDesktop = ({
	match, 
	addNewComment,
	commentState,
	subCommentState,
	setSubCommentState,
	setCommentState,
	addSubComment,
	addLikeToComment,
	tabValue, 
	handleTabChange, 
	subscribePanel, 
	handleSubscribePanel,
}) => {
	const { comments, commentsCount } = CommentSelectors();
	const { planData: { geom, countyName } } = PlanSelectors();
	const isPlanHaveComments = comments.length > 0;
	
	return (
		<Template match={match}>
			<Route path={match.url + '/comments'} render={props => 
				<CommentsTab 
					addLikeToComment={addLikeToComment}
					commentState={commentState}
					addSubComment={addSubComment}
					addNewComment={addNewComment}
					subCommentState={subCommentState}
					setSubCommentState={setSubCommentState}
					setCommentState={setCommentState}
					{...props}
				/>
			}	/>
			<Route path={match.url + '/summary'} render={props => <SummaryTab/>}	/>
		</Template>
	);
};

PlanDesktop.propTypes = {
	setCommentState: PropTypes.func.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	commentState: PropTypes.object.isRequired,
	subCommentState: PropTypes.object.isRequired,
	tabValue: PropTypes.number.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	addNewComment: PropTypes.func.isRequired,
	addLikeToComment: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
};

export default PlanDesktop;