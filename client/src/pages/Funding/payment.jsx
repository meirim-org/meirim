import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';
import * as SC from './style';

const Payment = ({ url, class, onClose, errors, inputFocus, inputBlur }) => {

	return (
			<SC.MainWrapper>
				<Iframe url="https://icom.yaad.net/p3/?action=pay&Amount=50&Coin=1&HK=True&Info=%D7%AA%D7%A8%D7%95%D7%9E%D7%94%20%D7%97%D7%95%D7%93%D7%A9%D7%99%D7%AA%20%D7%9C%D7%A2%D7%9E%D7%95%D7%AA%D7%AA%20%D7%9E%D7%A2%D7%99%D7%A8%D7%99%D7%9D&Masof=0010157216&OnlyOnApprove=True&PageLang=HEB&Pritim=True&SendHesh=True&UTF8=True&UTF8out=True&action=pay&heshDesc=~%D7%AA%D7%A8%D7%95%D7%9E%D7%94%2520%D7%97%D7%95%D7%93%D7%A9%D7%99%D7%AA%2520%D7%9C%D7%A2%D7%9E%D7%95%D7%AA%D7%AA%2520%D7%9E%D7%A2%D7%99%D7%A8%D7%99%D7%9D~1~50&sendemail=True&tmp=11&signature=537cae1aad0509bde1ea45ce291b2e1cbb73a97a59db5907c2f53a1c1f556e67"
					width="800px"
					height="940px"
					className={class}
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
	url: PropTypes.string.isRequired
};

export default Payment;
