import React, { useEffect, useState } from 'react';
import * as SC from './style';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../../../../redux/modal/slice';
import PropTypes from 'prop-types';
import api from '../../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '../../../../locale/he_IL';
const DowngradeSubscriptionModal = ({ paymentLink }) => {
	const dispatch = useDispatch();
	const [alertsQty, setAlertsQty] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const qs = new URLSearchParams(paymentLink);
	const amount = parseInt(qs.get('Amount'));
	const planId = parseInt(qs.get('planId'));
	const { t } = useTranslation();

	useEffect(() => {
		api.get('/subscription_plans').then((plans) => {
			const plan = plans.find((plan) => plan.id === planId);
			setAlertsQty(plan.alerts_qty);
			setIsLoading(false);
		});
	}, [planId]);

	return (
		<>
			{isLoading ? (
				<SC.LoadingWrapper>
					<FontAwesomeIcon icon="spinner" spin className="loading" />
				</SC.LoadingWrapper>
			) : (
				<>
					<SC.H3>
						{t.updatingTheProgramTo}:{' '}
						<SC.Span_colored>{`${alertsQty} ${t.addresses}`}</SC.Span_colored>
					</SC.H3>
					<SC.P_bold>
						{t.nextBillingDateYouWillBeCharged.replace('$', amount)}
					</SC.P_bold>
					<SC.ButtonWrapper>
						<SC.Button
							className="secondary"
							onClick={() => dispatch(closeModal())}
						>
							{t.cancel}
						</SC.Button>
						<SC.Button
							className="primary"
							onClick={() =>
								dispatch(
									openModal({
										modalType: 'iframeModal',
										modalProps: {
											wrapperClass: 'newDesignModal',
											url: paymentLink,
										},
									})
								)
							}
						>
							{t.approve}
						</SC.Button>
					</SC.ButtonWrapper>
				</>
			)}
		</>
	);
};

DowngradeSubscriptionModal.propTypes = {
	paymentLink: PropTypes.string,
};

export default DowngradeSubscriptionModal;
