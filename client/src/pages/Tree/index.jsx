import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Route, Switch } from 'react-router-dom';
import { withGetScreen } from 'react-getscreen';
import { useDataHandler } from './hooks';
import { openModal } from 'redux/modal/slice';
import { CommentsTab, SummaryTab } from 'pages/Tree/containers';
import { useDispatch } from 'react-redux';
import { UserSelectors, CommentSelectors } from 'redux/selectors';
import TreeMobile from './mobile';
import TreeDesktop from './desktop';
import { addComment, addLike } from './controller';

const Tree = ({ isMobile, isTablet, match }) => {
	const { id: treeId } = useParams();
	const [refetchComments, setRefetchComments] = useState(false);
	useDataHandler(treeId);
	// useCommentsDataHandler(treeId, refetchComments, setRefetchComments);
	const dispatch = useDispatch();
	const [tabValue, setValue] =useState('');
	
	const handleTabChange = (_, newValue) => setValue(newValue);
	
	const treeProps = {
		handleTabChange,
		match,
	};
	
	// TODO mobile
	// const Template = isMobile() || isTablet() ? TreeMobile : TreeDesktop;

	const Template = TreeDesktop;
	return (
		<Template {...treeProps}>
			<Switch>
				{/* <Route path={match.url + '/comments'} render={props => 
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
				/> */}
				<Route path={match.url + '/'} render={props => 
					<SummaryTab 
						// subscribePanel={subscribePanel} 
						// handleSubscribePanel={handleSubscribePanel} 
						{...props}
					/>}	
				/>
			</Switch>	
		</Template>
	);
};

Tree.propTypes = {
	isMobile:PropTypes.func.isRequired,
	isTablet:PropTypes.func.isRequired,
	match:PropTypes.object.isRequired,
};

export default withGetScreen(Tree, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });

