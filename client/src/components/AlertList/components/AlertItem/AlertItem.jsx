import React, { useState } from 'react';
import './style.js';
import * as SC from './style.js';
import { Button, Chip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import { CircularProgress, Text } from 'shared';
import { useTheme } from '@material-ui/styles';
import { DiamondIcon } from '../../../../shared/upgradeButton/Icons/index.js';
import api from '../../../../services/api';
import { useDispatch } from 'react-redux';
import { AlertsSelectors, UserSelectors } from '../../../../redux/selectors';
import { setAlerts } from '../../../../redux/alerts/slice';
import { toast } from 'react-toastify';
import { openModal } from '../../../../redux/modal/slice';
import {
	useUpdateManuallyUserState,
	useUpdateManuallyAlertsState,
} from '../../../../scenes/alerts/hooks';
import { useTranslation } from '../../../../locale/he_IL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AlertItem = ({ alert, type }) => {
	const theme = useTheme();
	const { subscribe_plan_id } = UserSelectors().user;
	const disabled = alert.disabled;
	const dispatch = useDispatch();
	const { list } = AlertsSelectors();
	const { handleGetMe } = useUpdateManuallyUserState();
	const { getAlerts } = useUpdateManuallyAlertsState();
	const { t } = useTranslation();
	const { user } = UserSelectors();
	const [isReactiveBtnDisabled, setIsReactivateBtnDisabled] = useState(false);

	const handleDelete = (alertId) => {
		api.delete('/alert/' + alertId)
			.then(() => {
				dispatch(
					setAlerts({
						list: list.filter((item) => item.id !== alertId),
					})
				);

				toast.success('התראת תכנון הוסרה בהצלחה');
				handleGetMe();
			})
			.catch((error) => toast.error(error));
	};

	const handleReactivate = async (alertId) => {
		try {
			setIsReactivateBtnDisabled(true);
			const responseAlert = await api.get('/alert');
			const { data: alerts } = responseAlert;
			const activePersonPlans = alerts.filter(
				(alert) => alert.type === 'plan' && !alert.disabled
			);

			const subscriptionPlans = await api.get('/subscription_plans');

			const alerts_qty = subscriptionPlans.find(
				(plan) => plan.id === user.subscribe_plan_id
			).alerts_qty;

			if (activePersonPlans.length < alerts_qty) {
				await api.post(`/alert/${alertId}/edit`, {
					disabled: false,
				});

				getAlerts();
				handleGetMe();
				return;
			}

			dispatch(
				openModal({
					modalType: 'upgradeModal',
					modalProps: {
						wrapperClass: 'upgradeModal',
					},
				})
			);
		} catch (err) {
			console.error(err);
		} finally {
			setIsReactivateBtnDisabled(false);
		}
	};

	return (
		<SC.Li disabled={disabled}>
			<SC.FlexWrapper>
				<SC.DivContent disabled={disabled}>
					<SC.Icon>
						<span role="img" aria-label="tree">
							{type === 'trees' ? '🌳' : '🏠'}
						</span>
					</SC.Icon>
					{type === 'trees' ? alert.place : alert.address}
				</SC.DivContent>

				<SC.Buttons>
					{!subscribe_plan_id && type === 'plans' && !disabled && (
						<Chip label={t.free} />
					)}

					{disabled && type === 'plans' ? (
						<>
							<Chip
								label={t.disabled}
								className="Disabled-chip"
								icon={<NotificationsOffIcon />}
							/>

							<Button
								className="Reactivate-button"
								variant="contained"
								color="primary"
								disabled={isReactiveBtnDisabled}
								onClick={() => handleReactivate(alert.id)}
								endIcon={
									!isReactiveBtnDisabled && <DiamondIcon />
								}
							>
								{!isReactiveBtnDisabled ? (
									<Text
										text={t.reactivate}
										size="15px"
										component="span"
										color={theme.palette.gray['800']}
									/>
								) : (
									<FontAwesomeIcon
										icon="spinner"
										spin
										className="loading"
									/>
								)}
							</Button>
						</>
					) : null}

					{subscribe_plan_id && type === 'plans' && !disabled && (
						<Chip
							label={t.premium}
							className="Premium-chip"
							icon={<DiamondIcon />}
						/>
					)}

					{!disabled && type === 'plans' && (
						<Button
							variant="contained"
							color="primary"
							onClick={() =>
								dispatch(
									openModal({
										modalType: 'editAlert',
										modalProps: {
											wrapperClass: 'alertModal',
											alertId: alert.id,
											alertRadius: alert.radius,
											alertAddress: alert.address,
										},
									})
								)
							}
						>
							<Text
								text={t.edit}
								size="15px"
								component="span"
								color={theme.palette.gray['800']}
							/>
						</Button>
					)}

					<Button
						variant="contained"
						color="primary"
						onClick={() => handleDelete(alert.id)}
						startIcon={<ClearIcon />}
					>
						<Text
							text={t.remove}
							size="15px"
							component="span"
							color={theme.palette.gray['800']}
						/>
					</Button>
				</SC.Buttons>
			</SC.FlexWrapper>

			{type === 'plans' && (
				<SC.DivInfo>
					<SC.RadiusLabel>{t.radius}:</SC.RadiusLabel>
					<SC.RadiusValue>
						{alert.radius} {t.km}
					</SC.RadiusValue>
				</SC.DivInfo>
			)}
		</SC.Li>
	);
};

AlertItem.defaultProps = {
	alert: {},
};

export default AlertItem;
