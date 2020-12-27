import React from 'react';
import t from '../locale/he_IL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types'

const AlertTableRow = (props) => {
	const { alert }= props;
	
	let address = '';
	let radius = '';
	if (alert.type === 'plan') {
		address = alert.address;
		radius = `${alert.radius} ${t.km}`;
	}
	if (alert.type === 'tree') {
		address = alert.place;
	}
	return (
		<tr key={alert.id}>
			<td>{address}</td>
			<td>{radius}</td>
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
	);
}

AlertTableRow.propTypes = {
	onDelete: PropTypes.func,
	alert: PropTypes.object,
}

export default AlertTableRow;