import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';
import { Modal } from '../../shared';
import * as SC from './style';

const PormotePayment = ({ url, display, onClose, errors, inputFocus, inputBlur }) => {
	//  const { url, display } = display;
	// const { nameError, emailError, passwordError } = errors
	// const { display, url } = props

	const modalClose = () => {
		if(onClose){
			onClose()
		}
	}

	return (
		display && <Modal id="funding-payment-modal" onClose={modalClose}>
			<SC.MainWrapper>
				<Iframe url={url}
					width="685px"
					height="875px"
					id="myId"
					className="myClassname"
					display="initial"
					position="relative"/>
			</SC.MainWrapper>
		</Modal>
	);
};

PormotePayment.propTypes = {
	values: PropTypes.shape({
		url: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		password: PropTypes.string.isRequired,
	}).isRequired,
	setValues: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	inputFocus: PropTypes.func,
	inputBlur: PropTypes.func,
	onClose: PropTypes.func
};

export default PormotePayment;
