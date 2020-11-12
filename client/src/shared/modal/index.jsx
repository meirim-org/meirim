/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import MUIModal from '@material-ui/core/Modal';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledModal = styled(MUIModal)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledIcon = styled(CloseIcon)`
	color: gray;
	cursor: pointer;
`;

const ModalWrapper = styled.div`
	padding-top: 0.5em;
	padding-right: 0.5em;
`;

const ModalContentWRapper = styled.div`
	display:flex;
	flex-direction: column;
	background-color: #ffffff;
	border-radius: 15px 15px;
`;

const IconWrapper = styled.div`
	padding-top: 0.5em;
	padding-right: 0.5em;
`;

const Modal = ({ children }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<ModalWrapper>
			<StyledModal open={isOpen}>
				<ModalContentWRapper>
					<IconWrapper>
						<StyledIcon onClick={() => setIsOpen(false)} />
					</IconWrapper>
					{children}
				</ModalContentWRapper>
			</StyledModal>
		</ModalWrapper>
	);
};

Modal.propTypes = {
	children: PropTypes.object.isRequired,
};

export default Modal;
