import React from 'react';
import PropTypes from 'prop-types';
import Mapa from 'components/Mapa';
import Wrapper from 'components/Wrapper';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Header, SummaryTab, CommentsTab } from './containers';
import * as SC from './style';

const PlanDesktop = ({ 
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
	const { comments } = CommentSelectors();
	const { planData: { geom, countyName } } = PlanSelectors();
	const isPlanHaveComments = comments.length > 0;
	
	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<Header
						handleTabChange={handleTabChange} 
						openNewCommentView={() => setCommentState(pv => ({ ...pv, isOpen: true }))} 
					/>
					<SC.Main className={!isPlanHaveComments ? 'no-comments' : ''}>
						{ 
							tabValue === 0 && 
							<SummaryTab 
								handleSubscribePanel={handleSubscribePanel}
						 		subscribePanel={subscribePanel} 
						 	/>
						}
						{ 
							tabValue === 1 && <CommentsTab
								commentState={commentState}
								subCommentState={subCommentState}
								setCommentState={setCommentState}
								setSubCommentState={setSubCommentState}
								addSubComment={addSubComment}
								addNewComment={addNewComment}
								addLikeToComment={addLikeToComment}
							/>
						}
					</SC.Main>
				</SC.Content>
				  <Mapa
					geom={geom}
					countyName={countyName}
					hideZoom={true}
					disableInteractions={true}
				/>
			</SC.MainWrapper>
		</Wrapper>
	);
};

PlanDesktop.propTypes = {
	setCommentState: PropTypes.func.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	commentState: PropTypes.object.isRequired,
	subCommentState: PropTypes.number.isRequired,
	tabValue: PropTypes.number.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	addNewComment: PropTypes.func.isRequired,
	addLikeToComment: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
};

export default PlanDesktop;