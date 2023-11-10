import { Badge } from '@material-ui/core';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { tabIsActive } from 'utils';
import { Title } from './components';
import * as SC from './style';
import { UpgradeButton } from 'shared';
import { openModal } from '../../../../../redux/modal/slice';
import { useDispatch } from 'react-redux';
import { UserSelectors } from '../../../../../redux/selectors';

const Header = ({ match, alerts }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { t } = useTranslation();
	const pathData = {
		pathName: history.location.pathname,
		planId: match.params.id,
	};

	const subscribe_plan_id = UserSelectors().user.subscribe_plan_id;

	const trees = alerts.filter((alert) => alert.type === 'tree');
	const plans = alerts.filter((alert) => alert.type === 'plan');

	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<Title
					countyName={t.alerts}
					planName={t.alertsDescription}
					arrowIsHidden={true}
				/>
				<SC.AppBar position="static">
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
									subscribe_plan_id
										? t.mySubscription
										: t.packageUpgrade
								}
								showIcon={!subscribe_plan_id}
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
			</SC.TitlesAndTabs>
		</SC.Header>
	);
};

Header.propTypes = {
	match: PropTypes.object.isRequired,
	alerts: PropTypes.array.isRequired,
};

export default Header;
