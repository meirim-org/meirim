import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import MUIModal from '@material-ui/core/Modal';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { device } from '../../style';

const StyledModal = styled(MUIModal)`
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: scroll;
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
	max-width: 93vw;
    @media ${device.tablet} {
      max-width: initial;
    }
`;

const IconWrapper = styled.div`
	padding-top: 0.5em;
	padding-right: 0.5em;
`;

const Modal = ({ id, children }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<ModalWrapper>
			<StyledModal id={id} open={isOpen}>
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
	id: PropTypes.string.isRequired,
};

export default Modal;
