import React, { useEffect } from 'react';
import { CheckIfUserCanAccessPage } from 'hooks';
import { Route, Switch, Redirect } from 'react-router-dom';
import AlertList from 'components/AlertList';
import { withGetScreen } from 'react-getscreen';
import PlanMobile from './mobile/';
import PlanDesktop from './desktop/';
import { AlertsSelectors } from '../../redux/selectors';
import { useSuccessCloseHandler, useUpdateManuallyAlertsState } from './hooks';
import PropTypes from 'prop-types';

const Alert = ({ isMobile, isTablet, match }) => {
	CheckIfUserCanAccessPage();
	const { plans, trees } = AlertsSelectors();

	const alertsProps = {
		match,
		alerts: [...plans, ...trees],
	};

	const { getAlerts } = useUpdateManuallyAlertsState();

	useEffect(() => {
		getAlerts();
	}, []);

	useSuccessCloseHandler();

	const Template = isMobile() || isTablet() ? PlanMobile : PlanDesktop;

	return (
		<Template {...alertsProps}>
			<Switch>
				<Route exact path="/alerts">
					<Redirect to="/alerts/plans" />
				</Route>
				<Route
					path={match.url + '/trees'}
					render={() => <AlertList type="trees" alerts={trees} />}
				/>
				<Route
					path={match.url + '/plans'}
					render={() => <AlertList type="plans" alerts={plans} />}
				/>
			</Switch>
		</Template>
	);
};

Alert.propTypes = {
	isMobile: PropTypes.func,
	isTablet: PropTypes.func,
	match: PropTypes.object,
};

export default withGetScreen(Alert, {
	mobileLimit: 768,
	tabletLimit: 1024,
	shouldListenOnResize: true,
});
