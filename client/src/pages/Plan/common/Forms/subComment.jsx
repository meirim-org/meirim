import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import { Button } from 'shared';
import * as SC from './style';
import t from 'locale/he_IL';
import { TextareaAutosize } from '@material-ui/core';
import { UserSelectors } from 'redux/selectors';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { colors } from 'style';

export const SubCommentForm = ({ addSubComment, parentComment, subCommentState, setSubCommentState }) => {
	const dispatch = useDispatch();
	const { isAuthenticated } = UserSelectors();
	const { inputValue } = subCommentState;
	const [isOpen, setIsOpen] = useState(false);

	const buttonHandler = () => {
		if (isAuthenticated){
			setIsOpen(!isOpen);
		} else {
			dispatch(openModal({ modalType: 'login' }));
		}
	};

	return (
		<>
			<SC.AddSubComment className={isOpen ? 'active' : ''}>
				<Button
					id={'add-subcomment-' + parentComment.id}
					textcolor={colors.black}
					text={t.addAResponse}
					onClick={buttonHandler}
					simple
					iconBefore={<SC.CommentIcon/>}
				/>
			</SC.AddSubComment>
			{isOpen && <SC.addSubCommentWrapper>
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
						textcolor={colors.black}
						onClick={() => {
							setIsOpen(false);
							setSubCommentState(pv => ({ ...pv, isOpen: false }));
						}}
					/>
					<Button
						id="send-new-sub-opinion"
						text={t.send}
						fontWeight={'600'}
						small
						simple
						onClick={ 
							() => {
								setIsOpen(false); 
								addSubComment({ parentId: parentComment.id });
							}
						}
						disabled={!inputValue}
					/>
				</SC.addCommentButtonWrapper>
			</SC.addSubCommentWrapper>}
		</>
	);
};

SubCommentForm.propTypes = {
	parentComment: PropTypes.object.isRequired,
	setSubCommentState: PropTypes.func.isRequired,
	addSubComment: PropTypes.func.isRequired,
	subCommentState: PropTypes.object.isRequired,
};

export default SubCommentForm;