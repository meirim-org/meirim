import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'components/Wrapper';
import { CommentSelectors } from 'redux/selectors';
import { Header, Navigation, SummaryTab, CommentsTab } from './containers';
import * as SC from './style';
import classnames from 'classnames';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

const PlanMobile = ({
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
	const [tabsPanelRef, setTabsPanelRef] = useState(null);
	const [fixedHeader, setFixedHeader] = useState(false);

	const { comments } = CommentSelectors();
	const isPlanHaveComments = comments.length > 0;
	let tabsPanelTop = tabsPanelRef ? tabsPanelRef.current.getBoundingClientRect().top : null;

	const handleTabsPanelRef = (ref) => setTabsPanelRef(ref);
	const handleFixedHeader = (newValue) => setFixedHeader(newValue);

	const mainClasses = classnames({
		'no-comments': !isPlanHaveComments,
		'new-comment': commentState.isOpen
	});

	// eslint-disable-next-line no-unused-vars
	useScrollPosition(({ prevPos, currPos }) => {
	    if (currPos.y < -Math.abs(tabsPanelTop)) return  handleFixedHeader(true);
		
		return  handleFixedHeader(false);
	},[tabsPanelRef]);

	return (
		<Wrapper>
			<SC.MobileMainWrapper>
				<SC.Content>
					<Header
						handleTabsPanelRef={handleTabsPanelRef}
						fixedHeader={fixedHeader}
						handleTabChange={handleTabChange}
						openNewCommentView={()=> setCommentState(pv => ({...pv, isOpen :true}))}
						isNewCommentOpen={commentState.isOpen}
					/>
					<SC.Main className={mainClasses}>
						{ 
						tabValue === 0 && <SummaryTab
							handleSubscribePanel={handleSubscribePanel}
							subscribePanel={subscribePanel}
							/>
				 		}
						{ 
						 tabValue === 1 && <CommentsTab
							addLikeToComment={addLikeToComment}
							commentState={commentState}
							addSubComment={addSubComment}
							addNewComment={addNewComment}
							subCommentState={subCommentState}
							setSubCommentState={setSubCommentState}
							setCommentState={setCommentState}
							/>
 						}
					</SC.Main>
					<Navigation
						handleTabChange={handleTabChange}
						openNewCommentView={() => setCommentState(pv => ({...pv, isOpen: true}))}
					/>
				</SC.Content>
			</SC.MobileMainWrapper>
		</Wrapper>
	);
};

PlanMobile.propTypes = {
	tabValue: PropTypes.any.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	setCommentState: PropTypes.func.isRequired,
	commentState: PropTypes.object.isRequired,
	subCommentState: PropTypes.object.isRequired,
	closeNewCommentView: PropTypes.func.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
};

export default PlanMobile;