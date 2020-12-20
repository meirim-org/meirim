// import React from 'react';
// import PropTypes from 'prop-types';
// import Wrapper from 'components/Wrapper';
// import { Header, GoalsPanel, PlanDetaillPanel, StatsPanel, SubscribePanel, CommentPanel, NewCommentForm } from '../components';
// import * as SC from '../mobile-style';
// import t from 'locale/he_IL';
//
// const PlanMobile = ({ tabValue, handleTabChange, planData, dataArea, textArea, commentsData,
// 	newComment, handleNewComment, subscribePanel, handleSubscribePanel, newCommentType, handleNewCommentType, commentTypes, newCommentTypeError,
// 	handleNewCommentTypeError, newCommentText, handleNewCommentText }) => {
//
// 	const { name, countyName, type, status, url, goalsFromMavat } = planData;
//
// 	//Temporary
// 	const planTerms = ['פינוי בינוי', 'חלוקת מגרשים', 'שיקום עירוני'];
//		
// 	return (
// 	    <Wrapper>
// 			<SC.MobileMainWrapper>
// 				<SC.Content>
// 					<Header 
// 						tabValue={tabValue}
// 						handleTabChange={handleTabChange} 
// 						handleNewComment={handleNewComment} 
// 						name={name}
// 						countyName={countyName}
// 						comments={commentsData.length.toString()}
// 					/>
// 					<SC.Main className={commentsData.length === 0 ? 'no-comments' : ''}>
// 						<PlanDetaillPanel tabValue={tabValue} type={type} status={status} url={url} terms={planTerms} />
// 						<GoalsPanel goalsFromMavat={goalsFromMavat} tabValue={tabValue} />
// 						<SubscribePanel 
// 							tabValue={tabValue}
// 						 	subscribePanel={subscribePanel}
// 							handleSubscribePanel={handleSubscribePanel}/>
// 						<StatsPanel tabValue={tabValue} dataArea={dataArea} textArea={textArea} />
// 						<NewCommentForm 
// 							tabValue={tabValue}
// 							comments={commentsData.length}
// 							newComment={newComment}
// 							handleNewComment={handleNewComment}
// 							newCommentType={newCommentType}
// 							handleNewCommentType={handleNewCommentType}	
// 							newCommentText={newCommentText}
// 							handleNewCommentText={handleNewCommentText}
// 							commentTypes={commentTypes}
// 						    newCommentTypeError={newCommentTypeError}
// 							handleNewCommentTypeError={handleNewCommentTypeError} />
//
// 						{commentsData.length > 0 && 
// 							<>
// 								{commentsData.map((comment, index) => (
// 									<CommentPanel 
// 										key={index}
// 										id={index} 
// 										tabValue={tabValue}
// 										commentData={comment}
// 										newComment={newComment}
// 										handleNewComment={handleNewComment}
// 									/> 
// 								))}
// 							</>
// 						}
//
// 						{commentsData.length === 0 && !newComment &&
// 							<SC.NoComments>
// 								<SC.NoCommentsBold>{t.startDiscussion}</SC.NoCommentsBold>
// 								<br/>
// 								<SC.NoCommentsRegular>{t.shareThought}</SC.NoCommentsRegular>
// 							</SC.NoComments>
// 	 					}
//						
// 					</SC.Main>
// 				</SC.Content>
// 			</SC.MobileMainWrapper>
// 		</Wrapper>
// 	);
// };
//
// PlanMobile.propTypes = {
// 	planData: PropTypes.object.isRequired,
// 	tabValue: PropTypes.any.isRequired,
// 	dataArea: PropTypes.array.isRequired,
// 	commentTypes: PropTypes.array.isRequired,
// 	commentsData: PropTypes.array.isRequired,
// 	handleTabChange: PropTypes.func.isRequired,
// 	textArea: PropTypes.object.isRequired,
// 	subscribePanel: PropTypes.bool.isRequired,
// 	handleSubscribePanel: PropTypes.func.isRequired,
// 	newComment: PropTypes.bool.isRequired,
// 	handleNewComment: PropTypes.func.isRequired,
// 	newCommentType: PropTypes.string.isRequired,
// 	handleNewCommentType: PropTypes.func.isRequired,
// 	newCommentText: PropTypes.string,
// 	handleNewCommentText: PropTypes.func.isRequired,
// 	newCommentTypeError: PropTypes.bool.isRequired,
// 	handleNewCommentTypeError: PropTypes.func.isRequired,
// };
//
// export default PlanMobile;
import React from 'react';
import PropTypes from 'prop-types';
import Mapa from 'components/Mapa';
import Wrapper from 'components/Wrapper';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Header, SummaryTab, CommentsTab } from './containers';
import * as SC from '../mobile-style';

const PlanMobile = ({
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
	const isPlanHaveComments = comments.length === 0;

	return (
		<Wrapper>
			<SC.MobileMainWrapper>
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
			</SC.MobileMainWrapper>
		</Wrapper>
	);
};

PlanMobile.propTypes = {
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

export default PlanMobile;