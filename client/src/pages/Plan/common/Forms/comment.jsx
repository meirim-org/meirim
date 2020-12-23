import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from 'shared';
import * as SC from './style';
import { useParams } from 'react-router-dom';
import { UserSelectors, CommentSelectors } from 'redux/selectors';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Radio } from '@material-ui/core';
import {  addComment } from 'pages/Plan/controller';
import { printRadioClass } from 'pages/Plan/utils';

const CommentForm = ({ 
	setRefetchComments,
	isNewCommentOpen, newCommentViewHandler,closeNewCommentView, 
	tabValue,
	newCommentText,	handleNewCommentText }) => {
	const theme = useTheme();
	const { id: planId } = useParams();
	const { user } = UserSelectors();
	const { comments } = CommentSelectors();
	const newCommentType = '';
	const commentTypes = [];
	const newCommentTypeError = false;

	return (
		<SC.NewCommentTabPanel value={tabValue} index={1} className={!comments ? 'no-comments' : ''}>
			<SC.ButtonWrapper>
				<Button
					id="add-opinion"
					text={t.addNewComment}
					iconBefore={<SC.CommentIcon/>}
					small
					altColor
					active={isNewCommentOpen}
					onClick={() => newCommentViewHandler()}
				/>
			</SC.ButtonWrapper>
			{isNewCommentOpen
				?
				<>
					<SC.NewCommentControl component="fieldset">
    					<SC.RadioGroup aria-label="comment-type" name="comment-type" row> {/*this is comment type*/}
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
						 rowsMin={5}/>
					</SC.NewCommentControl>
					<SC.addCommentButtonWrapper>
						<Button
							id="close-new-opinion"
							text={t.close}
							simple
							small
							textcolor={theme.palette.black}
							onClick={closeNewCommentView}
						/>
						<Button
							id="send-new-opinion"
							text={t.send}
							fontWeight={'600'}
							small
							simple
							onClick={async () => {
								await addComment({ content: newCommentText, planId, userId: user.id,userName: user.name });
								closeNewCommentView();
								setRefetchComments(true);
							}}
							disabled={newCommentTypeError}
						/>
					</SC.addCommentButtonWrapper>
				</>
				:
				null
			}
		</SC.NewCommentTabPanel>
	);
};

CommentForm.propTypes = {
	comments: PropTypes.number.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	newCommentViewHandler: PropTypes.func.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	closeNewCommentView: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
	tabValue: PropTypes.any.isRequired,
};

export default CommentForm;