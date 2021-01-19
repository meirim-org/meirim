import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Link } from '../../shared';
import { closeModal } from 'redux/modal/slice';
import * as SC from './style';
import { saveTransaction } from './controller';
import { successPageTransactionCompleteMessage } from './constants';
import t from 'locale/he_IL';

const SuccessPayment = ({ ...props }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const notifyTransactionComplete = () => {
		window.top.postMessage(
			JSON.stringify({
				error: false,
				message: successPageTransactionCompleteMessage
			})
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
		<SC.SuccessWindowWrapper>
			<SC.PaymentSuccessIcon/>
			<SC.CentredThankYouTitle>{t.fundingSuccessTitle}</SC.CentredThankYouTitle>
			<SC.CentredThankYouSubTitle>{t.fundingSuccessText}</SC.CentredThankYouSubTitle>
			<SC.SuccessCloseWrapper>
				<Button
					id="button-plans"
					text={t.fundingSuccessPlans}
					onClick={() => {
						dispatch(closeModal());
						history.push(`/plans/`);
					}}
					small
				/>
				<Button
					id="button-home"
					text={t.fundingSuccessHome}
					onClick={() => {
						dispatch(closeModal());
						history.push(`/`);
						window.scroll({ top: 0, left: 0, behavior: 'smooth'});
					}}
					small
				/>
				<Link onClick={() => dispatch(closeModal()) } text={t.fundingSuccessClose}/>
			</SC.SuccessCloseWrapper>
		</SC.SuccessWindowWrapper>
	);
};

export default SuccessPayment;
