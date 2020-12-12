import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel,Button, Typography } from 'shared';
import * as SC from './style';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Radio } from '@material-ui/core';
import { printRadioClass } from '../utils';

export const NewCommentForm = ({ comments, newComment, handleNewComment, newCommentType, 
	handleNewCommentType, commentTypes, newCommentTypeError, tabValue }) => {
	const theme = useTheme();

	return (
		<TabPanel value={tabValue} index={1}>
			<SC.ButtonWrapper className={!comments ? 'no-opinions' : ''}>
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
						{newCommentTypeError
							?
							<SC.ErrorWrapper>
								<Typography
									variant="chipsAndIconButtons"
									mobileVariant="chipsAndIconButtons"
									component="span"
									color={theme.palette.red}
								>
									{t.chooseType}
								</Typography>
							</SC.ErrorWrapper> :
							null
						}
					</SC.NewCommentControl>
					<SC.NewCommentControl fullWidth={true}>
						<SC.TextareaAutosize disabled={newCommentTypeError} aria-label={t.emptyTextarea} rowsMin={5}/>
					</SC.NewCommentControl>
					<SC.addCommentButtonWrapper>
						<Button
							id="close-new-opinion"
							text={t.close}
							simple
							small
							textColor={theme.palette.black}
							onClick={() => handleNewComment(false)}
						/>
						<Button
							id="send-new-opinion"
							text={t.send}
							fontWeight={600}
							small
							simple
							onClick={() => ''}
							disabled={newCommentTypeError}
						/>
					</SC.addCommentButtonWrapper>
				</>
				:
				null
			}
		</TabPanel>
	);
};

NewCommentForm.defaultProps = {
	// NewCommentForm: false
};

NewCommentForm.propTypes = {
	comments: PropTypes.bool.isRequired,
	newComment: PropTypes.bool.isRequired,
	handleNewComment: PropTypes.func.isRequired,
	newCommentType: PropTypes.string.isRequired,
	commentTypes: PropTypes.array.isRequired,
	handleNewCommentType: PropTypes.func.isRequired,
	newCommentTypeError: PropTypes.bool.isRequired,
	handleNewCommentTypeError: PropTypes.func.isRequired,
	// commentData: PropTypes.object.isRequired,
	tabValue: PropTypes.string.isRequired,
};
