import React from 'react';
import PropTypes from 'prop-types';
import Mapa from 'components/Mapa';
import Wrapper from 'components/Wrapper';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Header, SummaryTab, CommentsTab } from './containers';
import * as SC from './style';

const PlanDesktop = ({ 
	setRefetchComments,
	tabValue, handleTabChange, 
	isNewCommentOpen,
	newCommentViewHandler,
	openNewCommentView,
	closeNewCommentView, 
	subscribePanel, handleSubscribePanel, 
	newCommentText, handleNewCommentText }) => {
	const { planData, dataArea, textArea } = PlanSelectors();
	const { comments } = CommentSelectors();
	const { name, countyName, geom } = planData;
	const isPlanHaveComments = comments.length > 0;

	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<Header 
						tabValue={tabValue}
						handleTabChange={handleTabChange} 
						openNewCommentView={openNewCommentView} 
						name={name}
						countyName={countyName}
					/>
					<SC.Main className={!isPlanHaveComments ? 'no-comments' : ''}>
						<SummaryTab 
							handleSubscribePanel={handleSubscribePanel}
							dataArea={dataArea} textArea={textArea}
						 	tabValue={tabValue} subscribePanel={subscribePanel} 
						 	planData={planData} />
						<CommentsTab
							setRefetchComments={setRefetchComments}
							tabValue={tabValue}
							isNewCommentOpen={isNewCommentOpen}
							newCommentViewHandler={newCommentViewHandler}
							closeNewCommentView={closeNewCommentView}
							newCommentText={newCommentText} handleNewCommentText={handleNewCommentText} />
					</SC.Main>
				</SC.Content>
				  {geom && <Mapa
					geom={geom}
					hideZoom={true}
					disableInteractions={true}
					title={countyName}
				/>}
			</SC.MainWrapper>
		</Wrapper>
	);
};

PlanDesktop.propTypes = {
	tabValue: PropTypes.any.isRequired,
	newCommentViewHandler: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
	closeNewCommentView: PropTypes.func.isRequired, 
	commentTypes: PropTypes.array.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
};

export default PlanDesktop;