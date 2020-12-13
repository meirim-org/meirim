import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from 'shared';
import * as SC from './style';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Radio, TextareaAutosize } from '@material-ui/core';
import { printRadioClass, handleNewCommentSubmit } from '../utils';

export const NewCommentForm = ({ comments, newComment, handleNewComment, newCommentType, 
	handleNewCommentType, commentTypes, newCommentTypeError, handleNewCommentTypeError, tabValue,
	newCommentText,	handleNewCommentText }) => {
	const theme = useTheme();

	return (
		<SC.NewCommentTabPanel value={tabValue} index={1} className={!comments ? 'no-comments' : ''}>
			<SC.ButtonWrapper>
				<Button
					id="add-opinion"
					text={t.addAnOpinion}
					iconBefore={<SC.CommentIcon/>}
					small
					altColor
					active={newComment}
					onClick={()=>handleNewComment(!newComment)}
				/>
			</SC.ButtonWrapper>
			{newComment
				?
				<>
					<SC.NewCommentControl component="fieldset">
    					<SC.RadioGroup aria-label="comment-type" name="comment-type" value={newCommentType}
							onChange={handleNewCommentType} row>
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
							onClick={() => handleNewComment(false)}
						/>
						<Button
							id="send-new-opinion"
							text={t.send}
							fontWeight={'600'}
							small
							simple
							onClick={() => handleNewCommentSubmit(newCommentType, handleNewCommentTypeError)}
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

NewCommentForm.propTypes = {
	comments: PropTypes.number.isRequired,
	newComment: PropTypes.bool.isRequired,
	handleNewComment: PropTypes.func.isRequired,
	newCommentType: PropTypes.string.isRequired,
	commentTypes: PropTypes.array.isRequired,
	handleNewCommentType: PropTypes.func.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	newCommentTypeError: PropTypes.bool.isRequired,
	handleNewCommentTypeError: PropTypes.func.isRequired,
	tabValue: PropTypes.any.isRequired,
};

export const NewSubCommentForm = ({ newSubComment, handleNewSubComment }) => {
	const theme = useTheme();

	return (
		<SC.addSubCommentWrapper>
			<SC.FormControl fullWidth={true}>
				<TextareaAutosize aria-label={t.emptyTextarea} rowsMin={5}/>
			</SC.FormControl>
			<SC.addCommentButtonWrapper className={newSubComment ? 'active' : ''} >
				<Button
					id="close-new-opinion"
					text={t.close}
					simple
					small
					textcolor={theme.palette.black}
					onClick={() => handleNewSubComment(false)}
				/>
				<Button
					id="send-new-opinion"
					text={t.send}
					fontWeight={'600'}
					small
					simple
					onClick={() => ''}
				/>
			</SC.addCommentButtonWrapper>

		</SC.addSubCommentWrapper>
	);
};

NewSubCommentForm.propTypes = {
	newSubComment: PropTypes.bool.isRequired,
	handleNewSubComment: PropTypes.func.isRequired,
};

