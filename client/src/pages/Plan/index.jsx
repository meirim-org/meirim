import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Route, Switch } from 'react-router-dom';
import { withGetScreen } from 'react-getscreen';
import {
	useDataHandler,
	useCommentsDataHandler,
	isFavoritePlan,
} from './hooks';
import { openModal } from 'redux/modal/slice';
import {
	CommentsTab,
	SummaryTab,
	PlanningInfoTab,
} from 'pages/Plan/containers';
import { useDispatch } from 'react-redux';
import { UserSelectors } from 'redux/selectors';
import PlanMobile from './mobile/';
import PlanDesktop from './desktop/';
import {
	addComment,
	addLike,
	unsubscribeUserToPlan,
	subscribeUserToPlan,
} from './controller';

const Plan = ({ isMobile, isTablet, match }) => {
	const { id: planId } = useParams();
	const [refetchComments, setRefetchComments] = useState(false);
	useDataHandler(planId);
	useCommentsDataHandler(planId, refetchComments, setRefetchComments);
	const dispatch = useDispatch();
	const { isAuthenticated, user } = UserSelectors();
	const [subCommentState, setSubCommentState] = useState({
		isOpen: false,
		inputValue: '',
	});
	const [commentState, setCommentState] = useState({
		isOpen: false,
		inputValue: '',
		type: 'improvement',
	});
	const [subscribePanel, setSubscribePanel] = useState(true);
	const [isFavPlan, setIsFavPlan] = useState(false);

	const getIsFav = React.useCallback(async () => {
		if (!user.id) return;
		const isFav = await isFavoritePlan(user.id, planId);
		setIsFavPlan(isFav);
	}, [user.id, planId]);

	useEffect(() => {
		const handler = async () => {
			await getIsFav();
		};
		handler();
	}, [getIsFav]);

	const subscriptionHandler = async () => {
		if (!isAuthenticated)
			return dispatch(openModal({ modalType: 'login' }));
		const isFav = await isFavoritePlan(user.id, planId);
		if (isFav) {
			await unsubscribeToPlan();
		} else {
			await subscribeToPlan();
		}
		await getIsFav();
	};

	const unsubscribeToPlan = async () => {
		await unsubscribeUserToPlan(planId);
	};
	const subscribeToPlan = async () => {
		await subscribeUserToPlan(planId);
	};

	const addLikeToComment = async (commentId) => {
		if (!isAuthenticated)
			return dispatch(openModal({ modalType: 'login' }));
		await addLike({ commentId });
		setRefetchComments();
	};

	const newCommentViewHandler = () => {
		if (isAuthenticated) {
			setCommentState((pv) => ({ ...pv, isOpen: true }));
		} else {
			dispatch(openModal({ modalType: 'login' }));
		}
	};

	const addNewComment = async () => {
		await addComment({
			content: commentState.inputValue,
			planId,
			userId: user.id,
			username: user.name,
			type: commentState.type,
		});
		setCommentState((pv) => ({ ...pv, isOpen: false, inputValue: '' }));
		setRefetchComments(true);
	};

	const addSubComment = async ({ parentId }) => {
		await addComment({
			content: subCommentState.inputValue,
			planId,
			userId: user.id,
			username: user.name,
			parentId,
		});
		setSubCommentState((pv) => ({ ...pv, inputValue: '', isOpen: false }));
		setRefetchComments(true);
	};

	const handleSubscribePanel = (newValue) => setSubscribePanel(newValue);

	const planProps = {
		commentState,
		setCommentState,
		match,
		subscriptionHandler,
		isFavPlan,
		newCommentViewHandler,
	};

	const Template = isMobile() || isTablet() ? PlanMobile : PlanDesktop;

	return (
		<Template {...planProps}>
			<Switch>
				<Route
					path={match.url + '/info'}
					render={(props) => <PlanningInfoTab {...props} />}
				/>
				<Route
					path={match.url + '/comments'}
					render={(props) => (
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
					)}
				/>
				<Route
					path={match.url + '/'}
					render={(props) => (
						<SummaryTab
							subscribePanel={subscribePanel}
							handleSubscribePanel={handleSubscribePanel}
							planId={planId}
							{...props}
						/>
					)}
				/>
			</Switch>
		</Template>
	);
};

Plan.propTypes = {
	isMobile: PropTypes.func.isRequired,
	isTablet: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default withGetScreen(Plan, {
	mobileLimit: 768,
	tabletLimit: 1024,
	shouldListenOnResize: true,
});
