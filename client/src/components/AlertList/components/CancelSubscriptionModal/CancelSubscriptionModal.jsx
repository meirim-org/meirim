import React from 'react';
import * as SC from './style';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../../../../redux/modal/slice';
import api from '../../../../services/api';
import {
	useUpdateManuallyAlertsState,
	useUpdateManuallyUserState,
} from '../../../../scenes/alerts/hooks';
import { useTranslation } from '../../../../locale/he_IL';
import { toast } from 'react-toastify';
const CancelSubscriptionModal = () => {
	const dispatch = useDispatch();
	const { handleGetMe } = useUpdateManuallyUserState();
	const { getAlerts } = useUpdateManuallyAlertsState();
	const { t } = useTranslation();

	const approveHandler = () => {
		api.post('/subscription_cancel')
			.then((res) => {
				const { end_date } = res.data;
				dispatch(
					openModal({
						modalType: 'successCancelModal',
						modalProps: {
							wrapperClass: 'newDesignModal',
							endDate: end_date,
						},
					})
				);
				handleGetMe();
				getAlerts();
			})
			.catch((err) => {
				const { data: err_msg } = err.response.data;
				toast.error(err_msg);
				dispatch(closeModal());
			});
	};

	return (
		<>
			<SC.H3>{t.cancelYourPlan}</SC.H3>
			<SC.P_bold>{t.youWontGetAnyAdditionalCharges}</SC.P_bold>
			<SC.ButtonWrapper>
				<SC.Button
					className="secondary"
					onClick={() => dispatch(closeModal())}
				>
					{t.cancel}
				</SC.Button>
				<SC.Button className="primary" onClick={approveHandler}>
					{t.approve}
				</SC.Button>
			</SC.ButtonWrapper>
		</>
	);
};

export default CancelSubscriptionModal;
