import React from 'react';
import Iframe from 'react-iframe';
import * as SC from './style';

const IframeModal = ({ url }) => {
	return (
		<SC.Iframe>
			<Iframe
				url={url}
				id="external-payment-page"
				className="payment-popup"
				display="initial"
				zoom="0.75"
				position="relative"
			/>
		</SC.Iframe>
	);
};

export default IframeModal;
