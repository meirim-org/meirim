import React, { useEffect } from 'react';
import { CircularProgress } from 'shared';
import { saveTransaction } from './controller';
import { successPageTransactionCompleteMessage } from './constants';

const SuccessPayment = ({ ...props }) => {
	const notifyTransactionComplete = () => {
		window.top.postMessage(
			JSON.stringify({
				error: false,
				message: successPageTransactionCompleteMessage
			}),
			window.location.origin
		);
	};

	const saveSuccessfulTransaction = async (yaadId, hkId, amount) => {
		try {
			await saveTransaction({
				yaadId,
				hkId,
				amount
			});
		} catch (err) {
			// do not fail over this
			console.error('save transaction failed:', err);
		}

		notifyTransactionComplete();
	};

	useEffect(() => {
		// read query string
		const qs = new URLSearchParams(props.location.search);
		const id = parseInt(qs.get('Id'));
		const hkid = parseInt(qs.get('HKId'));
		const ccode = qs.get('CCode');
		const amount = parseInt(qs.get('Amount'));

		// check that payment was successful
		if (ccode === '0' && !isNaN(id) && !isNaN(amount)) {
			saveSuccessfulTransaction(id, isNaN(hkid) ? null : hkid, amount);
		}
	});

	return (
		<CircularProgress />
	);
};

export default SuccessPayment;
