import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from 'shared';
import { CommentSelectors } from 'redux/selectors';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Radio } from '@material-ui/core';
import { printRadioClass, commentTypes } from 'pages/Plan/utils';
import * as SC from './style';

const CommentForm = ({ addNewComment, commentState, setCommentState }) => {
	const theme = useTheme();
	const { type, inputValue, isOpen } = commentState;
	const { comments } = CommentSelectors();
	const newCommentTypeError = false;

	const handleNewCommentType = (v) => setCommentState(pv => ({ ...pv, type: v }));
	const handleNewCommentText = (v) => setCommentState(pv => ({ ...pv , inputValue: v }));
	const newCommentViewHandler = () => setCommentState(pv => ({ ...pv , isOpen: !isOpen }));

	return (
		<SC.NewCommentTabPanel index={1} className={!comments ? 'no-comments' : ''}>
			<>
				<SC.NewCommentControl component="fieldset">
					<SC.RadioGroup
						aria-label="comment-type"
						name="comment-type"
						row
						value={type}
						onChange={(e) => handleNewCommentType(e.target.value)}>
						{commentTypes.map((commentType, idx) => (
							<SC.NewCommentLabelWrapper key={idx}>
								<SC.NewCommentLabel
									className={printRadioClass(type, commentType.value, newCommentTypeError)}
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
						 value={inputValue}
						 onChange={(e) => {
							const length = e.target.value.length;
							if (length === 1200) return;
							handleNewCommentText(e.target.value);}
						}
						 disabled={newCommentTypeError}
						 aria-label={t.emptyTextarea}
						     inputProps={{ maxLength: 2 }}
						 rowsMin={5}/>
				</SC.NewCommentControl>
				<SC.addCommentButtonWrapper>
					<Button
						id="close-new-opinion"
						text={t.close}
						simple
						small
						textcolor={theme.palette.black}
						onClick={newCommentViewHandler}
					/>
					<Button
						id="send-new-opinion"
						text={t.send}
						fontWeight={'600'}
						small
						simple
						onClick={addNewComment}					
						disabled={newCommentTypeError || !inputValue}
					/>
				</SC.addCommentButtonWrapper>
			</>
		</SC.NewCommentTabPanel>
	);
};

CommentForm.propTypes = {
	comments: PropTypes.number.isRequired,
	commentState: PropTypes.object.isRequired,
	setCommentState: PropTypes.func.isRequired,
	addNewComment: PropTypes.func.isRequired,
};

export default CommentForm;