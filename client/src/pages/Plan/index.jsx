import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Route, Switch } from 'react-router-dom';
import { withGetScreen } from 'react-getscreen';
import { useDataHandler, useCommentsDataHandler } from './hooks';
import { openModal } from 'redux/modal/slice';
import { CommentsTab, SummaryTab } from 'pages/Plan/containers';
import { useDispatch } from 'react-redux';
import { UserSelectors, CommentSelectors } from 'redux/selectors';
import PlanMobile from './mobile/';
import PlanDesktop from './desktop/';
import { addComment, addLike } from './controller';

const Plan = ({ isMobile, isTablet, match }) => {
	const { id: planId } = useParams();
	const [refetchComments, setRefetchComments] = useState(false);
	useDataHandler(planId);
	useCommentsDataHandler(planId, refetchComments, setRefetchComments);
	const dispatch = useDispatch();
	const [tabValue, setValue] =useState(0);
	const { isAuthenticated, user } = UserSelectors();
	const { comments } = CommentSelectors();
	const [ subCommentState, setSubCommentState ] = useState({
		isOpen:false,
		inputValue: ''
	});
	const [ commentState, setCommentState ] = useState({
		isOpen: false,
		inputValue: '',
		type: 'improvement'
	});
	const [ subscribePanel, setSubscribePanel ] = useState(true);
    
	const showComments = comments.length > 0; 
	const showStartDiscussionPanel = comments.length === 0 &&  !commentState.isOpen;

	const openNewCommentView = () => {
		if (!isAuthenticated) return dispatch(openModal({ modalType: 'register' }));
		else {
	  	setCommentState(pv => ({ ...pv, isOpen: true }));
			window.scrollTo(0, 0);
		}
	};

	const addLikeToComment = async (commentId) => {
		if (!isAuthenticated) return dispatch(openModal({ modalType: 'register' }));
		await addLike({ commentId });
		setRefetchComments();
	};

	const addNewComment = async () => {
		await addComment({ 
			content: commentState.inputValue, 
			planId, 
			userId: user.id, 
			username: user.name, 
			type: commentState.type
		});	
		setCommentState(pv => ({ ...pv, isOpen: false, inputValue: '' }));
		setRefetchComments(true);
	};

	const addSubComment = async ({ parentId }) => {
		await addComment({ 
			content: subCommentState.inputValue, 
			planId, 
			userId: user.id, 
			username: user.name, 
			parentId 
		});	
		setSubCommentState(pv => ({ ...pv, inputValue: '', isOpen: false }));
		setRefetchComments(true);
	};
	const closeNewCommentView = () => setCommentState(pv => ({ ...pv, isOpen: false }));
	const newCommentViewHandler = () => {  
		if (!isAuthenticated) return dispatch(openModal({ modalType: 'register' }));
		setCommentState(pv => ({ ...pv, isOpen: !commentState.isOpen }));
	};

	const handleTabChange = (_, newValue) => setValue(newValue);
	const handleSubscribePanel = (newValue) => setSubscribePanel(newValue);

	
	const planProps = {
		commentState,
		setCommentState,
		subCommentState,
		setSubCommentState,
		addSubComment,
		addLikeToComment,
		tabValue,
		addNewComment,
		setRefetchComments,
		handleTabChange,
		subscribePanel,
		handleSubscribePanel,
		showComments,
		showStartDiscussionPanel,
		newCommentViewHandler,
		openNewCommentView,
		closeNewCommentView,
		match,
	};

	const Template = isMobile() || isTablet() ? PlanMobile : PlanDesktop;

	return (
		<Template {...planProps}>
			<Switch>
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
			</Switch>	
		</Template>
	);
};

Plan.propTypes = {
	isMobile:PropTypes.func.isRequired,
	isTablet:PropTypes.func.isRequired,
	match:PropTypes.object.isRequired,
};

export default withGetScreen(Plan, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });

