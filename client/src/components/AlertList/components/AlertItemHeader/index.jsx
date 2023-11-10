import React from 'react';
import * as SC from './style';
import { Button, UpgradeButton } from 'shared';
import AddIcon from '@material-ui/icons/Add';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withGetScreen } from 'react-getscreen';
import { UserSelectors } from '../../../../redux/selectors';
import { useTranslation } from '../../../../locale/he_IL';

const AlertItemHeader = ({ type, hideAddAlertBtn, isMobile }) => {
	const dispatch = useDispatch();
	const subscribePlanId = UserSelectors().user.subscribe_plan_id;
	const { t } = useTranslation();

	if (type === 'trees') {
		return (
			<SC.ButtonWrapper>
				<Button
					text={t.addAlert}
					fontSize={isMobile() ? '14px' : '18px'}
					fontWeight="600"
					small
					padding={isMobile() ? '10px 20px' : '12px 20px'}
					borderradius="8px"
					iconBefore={
						<AddIcon fontSize={isMobile() ? 'small' : 'default'} />
					}
					lineheight="24px"
					onClick={() =>
						dispatch(
							openModal({
								modalType: 'addAlert',
								modalProps: {
									wrapperClass: 'alertModal',
									type: 'tree',
								},
							})
						)
					}
				/>
			</SC.ButtonWrapper>
		);
	}

	if (type === 'plans') {
		return (
			<SC.ButtonWrapper>
				{hideAddAlertBtn && (
					<SC.ButtonWrapper__text>
						<p>
							{subscribePlanId ? (
								<b>‘ניצלת את כל ההתראות שברשותך</b>
							) : (
								<b>קיבלת מאיתנו התראה ראשונה חינמית!</b>
							)}
						</p>
						<p>ניתן לשדרג את החבילה כדי להוסיף יותר התראות</p>
					</SC.ButtonWrapper__text>
				)}

				{!hideAddAlertBtn ? (
					<Button
						text={t.addAlert}
						fontSize={isMobile() ? '14px' : '18px'}
						fontWeight="600"
						small
						padding={isMobile() ? '10px 20px' : '12px 20px'}
						borderradius="8px"
						iconBefore={
							<AddIcon
								fontSize={isMobile() ? 'small' : 'default'}
							/>
						}
						lineheight="24px"
						onClick={() =>
							dispatch(
								openModal({
									modalType: 'addAlert',
									modalProps: {
										wrapperClass: 'alertModal',
										type: 'plan',
									},
								})
							)
						}
					/>
				) : (
					<UpgradeButton
						variant="button"
						text={t.upgrade}
						onClick={() =>
							dispatch(
								openModal({
									modalType: 'upgradeModal',
									modalProps: {
										wrapperClass: 'upgradeModal',
									},
								})
							)
						}
					/>
				)}
			</SC.ButtonWrapper>
		);
	}

	return null;
};

AlertItemHeader.propTypes = {
	type: PropTypes.string.isRequired,
	hideAddAlertBtn: PropTypes.bool,
	isMobile: PropTypes.func.isRequired,
};

export default withGetScreen(AlertItemHeader, {
	mobileLimit: 768,
	tabletLimit: 1024,
	shouldListenOnResize: true,
});
