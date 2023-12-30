import React from 'react';
import * as SC from './style';
import AlertItem from './components/AlertItem';
import PropTypes from 'prop-types';
import EmptyState from './components/EmptyState';
import AlertItemHeader from './components/AlertItemHeader';
import '../../../node_modules/leaflet/dist/leaflet.css';
// import { UserSelectors } from '../../redux/selectors';

const AlertList = ({ type, alerts }) => {
	if (alerts.length) {
		// TODO: fix
		const isReachedMaxAlerts = false;
		// const isReachedMaxAlerts = JSON.parse(
		// 	UserSelectors().user.is_reached_max_alerts
		// );

		if (type === 'plans') {
			const plans = alerts.filter((alert) => alert.type === 'plan');
			const activePlans = plans.filter((alert) => !alert.disabled);
			const disabledPlans = plans.filter((alert) => alert.disabled);
			alerts = [...activePlans, ...disabledPlans];
		}

		return (
			<>
				<AlertItemHeader
					type={type}
					hideAddAlertBtn={Boolean(isReachedMaxAlerts)}
				/>

				<SC.Ul>
					{alerts.map((alert) => (
						<AlertItem alert={alert} type={type} key={alert.id} />
					))}
				</SC.Ul>
			</>
		);
	}

	return <EmptyState type={type} />;
};

AlertList.propTypes = {
	type: PropTypes.string.isRequired,
	alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AlertList;
