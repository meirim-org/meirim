import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'shared';
import * as SC from './style';
import { useParams } from 'react-router-dom';
import { UserSelectors } from 'redux/selectors';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { TextareaAutosize } from '@material-ui/core';
import { addComment } from 'pages/Plan/controller';

export const SubCommentForm = ({ setRefetchComments, parentComment, newSubComment, closeNewSubCommentView }) => {
	const theme = useTheme();
	const { id: planId } = useParams();
	const { user } = UserSelectors();
	const [inputValue, setInputValue] = useState('');

	return (
		<SC.addSubCommentWrapper>
			<SC.FormControl fullWidth={true}>
				<TextareaAutosize  
					onChange={e=> setInputValue(e.target.value)}
					value={inputValue} aria-label={t.emptyTextarea} rowsMin={5}/>
			</SC.FormControl>
			<SC.addCommentButtonWrapper className={newSubComment ? 'active' : ''} >
				<Button
					id="close-new-opinion"
					text={t.close}
					simple
					small
					textcolor={theme.palette.black}
					onClick={closeNewSubCommentView}
				/>
				<Button
					id="send-new-sub-opinion"
					text={t.send}
					fontWeight={'600'}
					small
					simple
					onClick={async () => {
						await addComment({ 
							content: inputValue, 
							planId, 
							userId: user.id, 
							username:user.name, 
							parentId: parentComment.id 
						});	
						closeNewSubCommentView();
						setRefetchComments(true);
					}} 
				/>
			</SC.addCommentButtonWrapper>

		</SC.addSubCommentWrapper>
	);
};

SubCommentForm.propTypes = {
	newSubComment: PropTypes.bool.isRequired,
	parentComment: PropTypes.object.isRequired,
	closeNewSubCommentView: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
};

export default SubCommentForm;