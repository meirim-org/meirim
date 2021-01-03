import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SummaryTab, CommentsTab } from 'pages/Plan/containers';
import Template from './template.jsx';

const PlanMobile = ({
	addNewComment,
	commentState,
	subCommentState,
	setSubCommentState,
	setCommentState,
	addSubComment,
	addLikeToComment,
	subscribePanel, 
	handleSubscribePanel,
	match
}) => {

	return (
		<Template match={match} commentState={commentState} setCommentState={setCommentState}>
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

PlanMobile.propTypes = {
	setSubCommentState: PropTypes.func.isRequired,
	setCommentState: PropTypes.func.isRequired,
	commentState: PropTypes.object.isRequired,
	subCommentState: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	addNewComment: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
	addLikeToComment: PropTypes.func.isRequired,
};

export default PlanMobile;