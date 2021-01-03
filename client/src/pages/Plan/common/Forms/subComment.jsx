import React  from 'react';
import PropTypes from 'prop-types';
import { Button } from 'shared';
import * as SC from './style';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { TextareaAutosize } from '@material-ui/core';

export const SubCommentForm = ({ addSubComment, parentComment, subCommentState, setSubCommentState }) => {
	const { inputValue, isOpen } = subCommentState;
	const theme = useTheme();

	return (
		<SC.addSubCommentWrapper>
			<SC.FormControl fullWidth={true}>
				<TextareaAutosize  
					id={parentComment.id}
					onChange={(e) => {
						const length = e.target.value.length;
						if (length === 1200) return;
						setSubCommentState(pv => ({ ...pv, inputValue: e.target.value }));}
					}
					value={inputValue} aria-label={t.emptyTextarea} rowsMin={5}/>
			</SC.FormControl>
			<SC.addCommentButtonWrapper className={isOpen ? 'active' : ''} >
				<Button
					id="close-new-opinion"
					text={t.close}
					simple
					small
					textcolor={theme.palette.black}
					onClick={() => setSubCommentState(pv => ({ ...pv, isOpen: false }))}
				/>
				<Button
					id="send-new-sub-opinion"
					text={t.send}
					fontWeight={'600'}
					small
					simple
					onClick={ () => addSubComment({ parentId: parentComment.id })}
					disabled={!inputValue}
				/>
			</SC.addCommentButtonWrapper>
		</SC.addSubCommentWrapper>
	);
};

SubCommentForm.propTypes = {
	newSubComment: PropTypes.bool.isRequired,
	parentComment: PropTypes.object.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
	subCommentState: PropTypes.object.isRequired,
};

export default SubCommentForm;