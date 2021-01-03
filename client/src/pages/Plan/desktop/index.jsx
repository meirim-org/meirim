import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SummaryTab, CommentsTab } from 'pages/Plan/containers';
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
	subscribePanel, 
	handleSubscribePanel,
}) => {
	
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
				/>}	
			/>
			<Route path={match.url + '/'} render={props => 
				<SummaryTab 
					subscribePanel={subscribePanel} 
					handleSubscribePanel={handleSubscribePanel} 
					{...props}
				/>}	
			/>
		</Template>
	);
};

PlanDesktop.propTypes = {
	setCommentState: PropTypes.func.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	commentState: PropTypes.object.isRequired,
	subCommentState: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	addNewComment: PropTypes.func.isRequired,
	addLikeToComment: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
};

export default PlanDesktop;
