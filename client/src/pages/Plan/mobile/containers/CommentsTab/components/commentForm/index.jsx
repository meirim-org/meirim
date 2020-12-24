import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from 'shared';
import * as SC from '../../style';
import { useParams } from 'react-router-dom';
import { UserSelectors, CommentSelectors } from 'redux/selectors';
import t from 'locale/he_IL';
import { AddComment } from 'pages/Plan/common';
import { useTheme } from '@material-ui/styles';
import { Radio } from '@material-ui/core';
import {  addComment } from 'pages/Plan/controller';
import { printRadioClass } from 'pages/Plan/utils';

const CommentForm = ({
	setRefetchComments,
	isNewCommentOpen, newCommentViewHandler,closeNewCommentView,
	tabValue,
	commentTypes,
	newCommentText,	handleNewCommentText,
	newCommentType, handleNewCommentType }) => {
	const theme = useTheme();
	const { id: planId } = useParams();
	const { user } = UserSelectors();
	const { comments } = CommentSelectors();
	const newCommentTypeError = false;

	return (
		<SC.NewCommentTabPanel value={tabValue} index={1} className={!comments ? 'no-comments' : ''}>
			{!isNewCommentOpen
				?
				<SC.ButtonWrapper>
					<AddComment isNewCommentOpen={isNewCommentOpen} newCommentViewHandler={newCommentViewHandler}/>
				</SC.ButtonWrapper>
				:
				<>
					<SC.NewCommentControl component="fieldset">
						<SC.RadioGroup
							aria-label="comment-type"
							name="comment-type"
							row
							value={newCommentType}
							onChange={(e) => handleNewCommentType(e.target.value)}>
							{commentTypes.map((commentType, idx) => (
								<SC.NewCommentLabelWrapper key={idx}>
									<SC.NewCommentLabel
										className={printRadioClass(newCommentType, commentType.value, newCommentTypeError)}
										value={commentType.value}
										control={<Radio/>}
										label={commentType.text}
									/>
								</SC.NewCommentLabelWrapper>
							))}
						</SC.RadioGroup>
						{newCommentTypeError &&
                        <SC.ErrorWrapper>
                        	<Typography
                        		variant="chipsAndIconButtons"
                        		mobileVariant="chipsAndIconButtons"
                        		component="span"
                        		color={theme.palette.red}
                        	>
                        		{t.chooseType}
                        	</Typography>
                        </SC.ErrorWrapper>
						}
					</SC.NewCommentControl>
					<SC.NewCommentControl fullWidth={true}>
						<SC.TextareaAutosize
							value={newCommentText}
							onChange={(e) => handleNewCommentText(e.target.value)}
							disabled={newCommentTypeError}
							aria-label={t.emptyTextarea}
							rowsMin={10}/>
					</SC.NewCommentControl>
					<SC.addCommentButtonWrapper>
						<Button
							id="send-new-opinion"
							text={t.publishComment}
							fontWeight={'700'}
							width="100%"
							onClick={async () => {
								await addComment({ content: newCommentText, planId, userId: user.id,userName: user.name });
								handleNewCommentText('');
								closeNewCommentView();
								setRefetchComments(true);
							}}
							disabled={newCommentTypeError}
						/>
					</SC.addCommentButtonWrapper>
				</>
			}
		</SC.NewCommentTabPanel>
	);
};

CommentForm.propTypes = {
	comments: PropTypes.number.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	newCommentViewHandler: PropTypes.func.isRequired,
	commentTypes: PropTypes.array.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	newCommentType: PropTypes.string,
	handleNewCommentType: PropTypes.func.isRequired,
	closeNewCommentView: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
	tabValue: PropTypes.any.isRequired,
};

export default CommentForm;