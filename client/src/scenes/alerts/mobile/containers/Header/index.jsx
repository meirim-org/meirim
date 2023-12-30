import { Badge } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { tabIsActive } from 'utils';
import * as SC from './style';
import { UpgradeButton } from 'shared';
import { useTranslation } from 'locale/he_IL';
import { UserSelectors } from '../../../../../redux/selectors';
import { openModal } from '../../../../../redux/modal/slice';
import { useDispatch } from 'react-redux';

const Header = ({ match, handleTabsPanelRef, fixedHeader, alerts }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const pathData = {
		pathName: history.location.pathname,
		planId: match.params.id,
	};
	const subscribePlanId = UserSelectors().user.subscribe_plan_id;
	const tabsPanelRef = useRef(null);
	useEffect(() => handleTabsPanelRef(tabsPanelRef));

	const trees = alerts.filter((alert) => alert.type === 'tree');
	const plans = alerts.filter((alert) => alert.type === 'plan');

	return (
		<SC.Header>
			<SC.HeaderContent>
				<SC.AppBar
					ref={tabsPanelRef}
					position="static"
					className={fixedHeader ? 'fixed' : ''}
				>
					<SC.TabWrapper>
						<SC.Tab
							className={
								tabIsActive('plans', pathData) ? 'active' : ''
							}
							onClick={() => {
								const url = match.url.endsWith('/')
									? match.url.slice(0, match.url.length - 1)
									: match.url;
								history.push(`${url}/plans`);
							}}
						>
							<Badge badgeContent={plans.length} color="primary">
								{t.alertsPlans}
							</Badge>
						</SC.Tab>
						<SC.Tab
							className={
								tabIsActive('trees', pathData) ? 'active' : ''
							}
							onClick={() => {
								const url = match.url.endsWith('/')
									? match.url.slice(0, match.url.length - 1)
									: match.url;
								history.push(`${url}/trees`);
							}}
						>
							<Badge badgeContent={trees.length} color="primary">
								{t.alertsTrees}
							</Badge>
						</SC.Tab>

						<SC.PlaneName>
							<UpgradeButton
								text={
									subscribePlanId
										? t.mySubscription
										: t.packageUpgrade
								}
								showIcon={!subscribePlanId}
								variant="string"
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
						</SC.PlaneName>
					</SC.TabWrapper>
				</SC.AppBar>
			</SC.HeaderContent>
		</SC.Header>
	);
};

Header.propTypes = {
	match: PropTypes.object.isRequired,
	fixedHeader: PropTypes.bool.isRequired,
	handleTabsPanelRef: PropTypes.func.isRequired,
	alerts: PropTypes.array.isRequired,
};

export default Header;
