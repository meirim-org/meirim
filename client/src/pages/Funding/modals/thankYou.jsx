import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Link } from 'shared';
import { closeModal } from 'redux/modal/slice';
import * as SC from './style';
import t from 'locale/he_IL';

const ThankYou = () => {
	const dispatch = useDispatch();
	const history = useHistory();

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

export default ThankYou;
