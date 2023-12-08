import React, { useEffect, useState } from 'react';
import * as SC from './style';
import CardItem from './components/CardItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from 'redux/modal/slice';
import api from '../../../../services/api';
import { UserSelectors } from '../../../../redux/selectors';
import { useTranslation } from '../../../../locale/he_IL';
import { createPaymentLink } from '../../../../scenes/alerts/controller';

const UpgradeModal = () => {
	const [subscriptionPlans, setSubscriptionPlans] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isPlanCancelled, setIsPlanCancelled] = useState(false);
	const [planEndDate, setPlanEndDate] = useState('');
	const [newPlanId, setNewPlanId] = useState(null);
	const { subscribe_plan_id: currentPlanId } = UserSelectors().user;
	const dispatch = useDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		api.get('/subscription_plans').then((plans) => {
			setSubscriptionPlans(plans);
		});

		api.get('/subscription_cancel').then((response) => {
			const { is_subscription_canceled, end_date, new_plan_id } =
				response.data;
			setIsPlanCancelled(Boolean(is_subscription_canceled));
			setPlanEndDate(end_date);
			setNewPlanId(new_plan_id);
			setIsLoading(false);
		});
	}, []);

	const handlePaymentRequest = async ({
		planId = null,
		redirectToContactUs = false,
	}) => {
		if (redirectToContactUs) {
			window.location.href = 'mailto:info@meirim.org';

			return dispatch(closeModal());
		}

		createPaymentLink({ amount: 1 }).then((url) => {
			console.log('iframe:', url);
			try {
				dispatch(
					openModal({
						modalType: 'iframeModal',
						modalProps: {
							url,
						},
					})
				);
			} catch (err) {
				console.error(err);
			}
		});

		// api.get(`/subscription_plans/${planId}/get_payment_link`).then(
		// 	(res) => {
		// 		const { data: paymentLink } = res;
		//
		// 		try {
		// 			if (currentPlanId > planId) {
		// 				return dispatch(
		// 					openModal({
		// 						modalType: 'downgradeSubscriptionModal',
		// 						modalProps: {
		// 							paymentLink,
		// 							wrapperClass: 'newDesignModal',
		// 						},
		// 					})
		// 				);
		// 			}
		//
		// 			setIsLoading(true);
		//
		// 			dispatch(
		// 				openModal({
		// 					modalType: 'iframeModal',
		// 					modalProps: {
		// 						url: paymentLink,
		// 					},
		// 				})
		// 			);
		// 		} catch (err) {
		// 			alert(err);
		// 		} finally {
		// 			setIsLoading(false);
		// 		}
		// 	}
		// );
	};

	const CancelMsg = () => {
		return (
			<>
				{t.toRemoveYourPackage}{' '}
				<a
					href="cancelSubscriptionModal"
					onClick={(e) => {
						e.preventDefault();
						dispatch(
							openModal({
								modalType: 'cancelSubscriptionModal',
								modalProps: {
									wrapperClass: 'newDesignModal',
								},
							})
						);
					}}
				>
					{t.clickHere}
				</a>
			</>
		);
	};

	return (
		<>
			<SC.TitleWrapper>
				{currentPlanId ? (
					<>
						<SC.PrimaryTitle>
							{t.updateTheNotificationPackage}
						</SC.PrimaryTitle>
						<SC.Text>{t.revenuInvestMessage}</SC.Text>
					</>
				) : (
					<>
						<SC.SecondaryTitle>
							{t.freeNotificationMessage}
						</SC.SecondaryTitle>
						<SC.PrimaryTitle>{t.upgradeToGetMore}</SC.PrimaryTitle>
					</>
				)}
			</SC.TitleWrapper>

			<SC.CardList>
				{isLoading ? (
					<FontAwesomeIcon icon="spinner" spin className="loading" />
				) : (
					<>
						{subscriptionPlans
							.sort((a, b) => a.alerts_qty - b.alerts_qty)
							.map((plan) => {
								const { alerts_qty, price, radius } = plan;

								return (
									<CardItem
										key={plan.id}
										alertAmount={alerts_qty}
										radius={Number(radius)}
										price={price}
										handlePaymentRequest={
											handlePaymentRequest
										}
										active={plan.id === currentPlanId}
										id={plan.id}
									/>
								);
							})}

						<CardItem
							contactUs={true}
							handlePaymentRequest={handlePaymentRequest}
						/>
					</>
				)}
			</SC.CardList>

			{!isLoading && (
				<SC.Note>
					{currentPlanId && !isPlanCancelled ? (
						<>
							{currentPlanId > newPlanId ? (
								<>
									<p>
										Your plan will be downgraded to from{' '}
										{planEndDate}
									</p>
									<CancelMsg />
								</>
							) : (
								<CancelMsg />
							)}
						</>
					) : currentPlanId && isPlanCancelled ? (
						<p>Your plan will be canceled on {planEndDate}</p>
					) : (
						t.revenuInvestMessage
					)}
				</SC.Note>
			)}
		</>
	);
};

export default UpgradeModal;
