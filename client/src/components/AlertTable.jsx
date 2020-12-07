import React from 'react';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import t from '../locale/he_IL';

function AlertTable(props) {
	const { alerts } = props;
	
	return (
		<table id="alertTable">
			<thead>
				<tr>
					<th>כתובת</th>
					<th>רדיוס</th>
					<th/>
				</tr>
			</thead>
			<tbody>
				{alerts.map((alert) => (
					<tr key={alert.id}>
						<td>{alert.address}</td>
						<td>{alert.radius + ' ' + t.km}</td>
						<td>
							<button
								className="delete"
								alt="מחק התראה"
								onClick={() => props.onDelete(alert.id)}
							>
								<FontAwesomeIcon icon="times" title="מחק התראה" />
							</button>
						</td>
					</tr>
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
