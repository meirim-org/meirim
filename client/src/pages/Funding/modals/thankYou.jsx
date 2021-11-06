import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { closeModal } from 'redux/modal/slice';
import { Button, Link } from 'shared';
import * as SC from './style';

const ThankYou = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { t } = useTranslation();

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
