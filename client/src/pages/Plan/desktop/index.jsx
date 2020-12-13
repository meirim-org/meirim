import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'components/Wrapper';
import { Header, GoalsPanel, StatusTypeUrlPanel, StatsPanel, CommentPanel, NewCommentForm } from '../components';
import * as SC from '../style';
import t from 'locale/he_IL';



const PlanDesktop = ({ tabValue, handleTabChange, planData, dataArea, textArea, commentsData,
	 newComment, handleNewComment, newCommentType, handleNewCommentType, commentTypes, newCommentTypeError,
	 handleNewCommentTypeError, newCommentText, handleNewCommentText }) => {
	const { name, countyName, type, status, url, goalsFromMavat } = planData;
	
	return (
	    <Wrapper>
			<SC.MainWrapper>
				<SC.Content>
					<Header 
						tablValue={tabValue}
						handleTabChange={handleTabChange} 
						name={name}
						countyName={countyName}
						comments={commentsData.length.toString()}
					/>
					<SC.Main className={commentsData.length === 0 ? 'no-comments' : ''}>
						<StatusTypeUrlPanel tabValue={tabValue} type={type} status={status} url={url} />
						<GoalsPanel goalsFromMavat={goalsFromMavat} tabValue={tabValue} />
						<StatsPanel tabValue={tabValue} dataArea={dataArea} textArea={textArea} />
						<NewCommentForm 
							tabValue={tabValue}
							comments={commentsData.length}
							newComment={newComment}
							handleNewComment={handleNewComment}
							newCommentType={newCommentType}
							handleNewCommentType={handleNewCommentType}	
							newCommentText={newCommentText}
							handleNewCommentText={handleNewCommentText}
							commentTypes={commentTypes}
						    newCommentTypeError={newCommentTypeError}
							handleNewCommentTypeError={handleNewCommentTypeError} />

						{commentsData.length > 0 && 
							<>
								{commentsData.map((comment, index) => (
									<CommentPanel 
										key={index} 
										tabValue={tabValue}
										commentData={comment}
										newComment={newComment}
										handleNewComment={handleNewComment}
									/> 
								))}
							</>
						}

						{commentsData.length === 0 && !newComment &&
							<SC.NoComments>
								<SC.NoCommentsBold>{t.startDiscussion}</SC.NoCommentsBold>
								<br/>
								<SC.NoCommentsRegular>{t.shareThought}</SC.NoCommentsRegular>
							</SC.NoComments>
	 					}
						
					</SC.Main>
				</SC.Content>
				<div>map</div>
			</SC.MainWrapper>
		</Wrapper>
	);
};

PlanDesktop.propTypes = {
	planData: PropTypes.object.isRequired,
	tabValue: PropTypes.number.isRequired,
	dataArea: PropTypes.array.isRequired,
	commentTypes: PropTypes.array.isRequired,
	commentsData: PropTypes.array.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	textArea: PropTypes.object.isRequired,
	newComment: PropTypes.bool.isRequired,
	handleNewComment: PropTypes.func.isRequired,
	newCommentType: PropTypes.string.isRequired,
	handleNewCommentType: PropTypes.func.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	newCommentTypeError: PropTypes.bool.isRequired,
	handleNewCommentTypeError: PropTypes.func.isRequired,
};

export default PlanDesktop;