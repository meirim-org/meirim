import React, { useEffect, useState } from 'react';
import * as SC from './style';
import GreenTickCircle from '../../../../shared/icons/GreenTickCircle';
import { ModalActions } from '../../../../redux/actions';
import { useUpdateManuallyUserState } from '../../../../scenes/alerts/hooks';
import api from 'services/api';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../../locale/he_IL';

const SuccessUpgradeModal = ({ redirectParams }) => {
	const [alertsQty, setAlertsQty] = useState(null);
	const [planPrice, setPlanPrice] = useState(null);
	const { handleGetMe } = useUpdateManuallyUserState();
	const { t } = useTranslation();

	useEffect(() => {
		handleGetMe();

		api.get('/subscription_plans').then((plans) => {
			const plan = plans.find(
				(plan) => plan.id === Number(redirectParams.planId)
			);
			setAlertsQty(plan.alerts_qty);
			setPlanPrice(plan.price);
		});
	}, [handleGetMe, redirectParams.planId]);

	const { mode } = redirectParams;

	return (
		<>
			<SC.IconWrapper>
				<GreenTickCircle />
			</SC.IconWrapper>

			<SC.TextWrapper>
				{(mode === 'upgrade' || mode === 'relativeUpgrade') && (
					<SC.Heading>
						{t.youIncreasedYourPlanTo}:{' '}
						<SC.BoldColored>
							{alertsQty} {t.addresses}
						</SC.BoldColored>
					</SC.Heading>
				)}

				{mode === 'downgrade' && (
					<SC.Heading>
						{t.youUpdatedYourPlanTo}:{' '}
						<SC.BoldColored>
							{alertsQty} {t.addresses}
						</SC.BoldColored>
					</SC.Heading>
				)}

				{mode === 'relativeUpgrade' && (
					<>
						<SC.P_relative>
							{t.youPaidTheRelativeCosts.replace('$', planPrice)}
						</SC.P_relative>

						<p style={{ textAlign: 'center' }}>
							now we charged {redirectParams.Amount} NIS
						</p>
					</>
				)}
			</SC.TextWrapper>

			<SC.ButtonWrapper>
				<SC.Button onClick={ModalActions().close}>{t.close}</SC.Button>
			</SC.ButtonWrapper>
		</>
	);
};

export default SuccessUpgradeModal;

SuccessUpgradeModal.propTypes = {
	redirectParams: PropTypes.object,
};
