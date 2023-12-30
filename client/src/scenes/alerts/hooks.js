import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import { successSubscriptionPlanUpdate } from './constants';
import api from '../../services/api';
import { authenticated } from '../../redux/user/slice';
import { setAlerts } from '../../redux/alerts/slice';

export const useSuccessCloseHandler = () => {
	const dispatch = useDispatch();
	const { getAlerts } = useUpdateManuallyAlertsState();

	const handleMessage = useCallback(
		(event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.message === successSubscriptionPlanUpdate) {
					dispatch(
						openModal({
							modalType: 'successUpgradeModal',
							modalProps: {
								wrapperClass: 'newDesignModal',
								redirectParams: data.redirectParams,
							},
						})
					);

					getAlerts();
				}
			} catch (err) {
				if (err instanceof SyntaxError) {
					// this just means event.data wasn't a valid json
				} else {
					throw err;
				}
			}
		},
		[dispatch, getAlerts]
	);

	useEffect(() => {
		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [handleMessage]);
};

export const useUpdateManuallyUserState = () => {
	const dispatch = useDispatch();

	const handleGetMe = () => {
		try {
			api.get('/me').then((response) => {
				const {
					name,
					id,
					admin,
					subscribe_plan_id,
					is_reached_max_alerts,
				} = response.me;

				dispatch(
					authenticated({
						user: {
							name,
							id,
							admin,
							subscribe_plan_id,
							is_reached_max_alerts,
						},
					})
				);

				return true;
			});
		} catch (err) {
			console.error(err);
		}
	};

	return {
		handleGetMe,
	};
};

export const useUpdateManuallyAlertsState = () => {
	const dispatch = useDispatch();

	const getAlerts = () => {
		try {
			api.get('/alert').then((result) => {
				dispatch(
					setAlerts({
						list: result.data,
					})
				);
			});
		} catch (err) {
			console.error(err);
		}
	};

	return {
		getAlerts,
	};
};
