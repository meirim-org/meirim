import React from 'react';
import PropTypes from 'prop-types'
import AlertTableRow from './AlertTableRow';

function AlertTable(props) {
	const { alerts } = props;

	return (
		<table id="alertTable">
			<thead>
				<tr>
					<th>כתובת</th>
					<th>רדיוס</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{alerts.map((alert) => (
					<AlertTableRow alert={alert} onDelete={props.onDelete} />
				))}
			</tbody>
		</table>
	);
}

AlertTable.propTypes = {
	onDelete: PropTypes.func,
	alerts: PropTypes.array,
}

export default AlertTable;
