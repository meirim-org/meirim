import React, { useEffect } from 'react';
import { CircularProgress } from 'shared';
import { saveTransaction } from './controller';
import { successSubscriptionPlanUpdate } from './constants';
import api from '../../services/api';

const SuccessPaymentAlert = ({ ...props }) => {
	const notifyTransactionComplete = (redirectParams) => {
		window.top.postMessage(
			JSON.stringify({
				error: false,
				message: successSubscriptionPlanUpdate,
				redirectParams,
			}),
			window.location.origin
		);
	};

	const saveSuccessfulTransaction = async (
		yaadId,
		hkId,
		amount,
		redirectParams,
		personId,
	) => {
		try {
			await saveTransaction({
				yaadId,
				hkId,
				amount,
				redirectParams,
				personId,
			});
		} catch (err) {
			// do not fail over this
			console.error('save transaction failed:', err);
		}

		notifyTransactionComplete(redirectParams);
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
			// build redirect params object
			let redirectParams = {};
			qs.forEach((value, key) => (redirectParams[key] = value));

			api.get('/me').then((res) => {
				const personId = res.me.id;

				saveSuccessfulTransaction(
					id,
					isNaN(hkid) ? null : hkid,
					amount,
					redirectParams,
					personId,
				);
			});
		}
	}, [props.location.search]);

	return <CircularProgress />;
};

export default SuccessPaymentAlert;
