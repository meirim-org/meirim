import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';
import * as SC from './style';

const Payment = ({ url, onClose, errors, inputFocus, inputBlur }) => {

	return (
			<SC.MainWrapper>
				<Iframe url={url}
					width="800px"
					height="940px"
					id="myId"
					className="myClassname"
					display="initial"
					position="relative"/>
			</SC.MainWrapper>
	);
};

Payment.propTypes = {
	setValues: PropTypes.func,
	handleSubmit: PropTypes.func,
	errors: PropTypes.object,
	inputFocus: PropTypes.func,
	inputBlur: PropTypes.func,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired,
	class:PropTypes.string
};

export default Payment;
