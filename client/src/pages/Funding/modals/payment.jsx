import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';
import * as SC from './style';

const Payment = ({ url }) => {

	return (
			<SC.MainWrapper>
				<SC.PaymnetModalWrapper>
					<Iframe url={url}
						id="external-payment-page"
						className="payment-popup"
						display="initial"
						zoom="0.75"
						position="relative"/>
				</SC.PaymnetModalWrapper>
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
