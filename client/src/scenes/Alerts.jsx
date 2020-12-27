import '../../node_modules/leaflet/dist/leaflet.css';
import 'rc-slider/assets/index.css';
import React from 'react';
import _ from 'lodash';
import leaflet from 'leaflet';
import Wrapper from '../components/Wrapper';
import Snackbar from '@material-ui/core/Snackbar';
import api from 'services/api';
import t from 'locale/he_IL';
import { CheckIfUserCanAccessPage } from 'hooks';
import './Alerts.css';
import AlertByAddress from './AlertByAddress';
import MyAlerts from './MyAlerts';
import AlertByCity from './AlertByCity';

const messages = {
	alertAdded:'התראת תכנון התווספה בהצלחה!',
	alertDeleted:'התראת תכנון הוסרה בהצלחה'
}

const initialBounds = [{ lat: 35, lng: 35 }, { lat: 25,lng: 25 }]
const initialSlider = { min: 1, max: 10 }

const Alerts = () => {
	CheckIfUserCanAccessPage()
	const [state, setState] = React.useState({ 
		error: false, loading: false, alerts: [], added: false,
		deleted: false, form: { radius: 5, address: '' }, bounds: initialBounds ,
		slider: initialSlider, sliderText: {} 
	})
    
	const handleClose = () => {
		setState(pv => ({
			...pv, 
			added: false,
			deleted: false
		}));
	};
    
	const { added, deleted } = state;

	return (
		<Wrapper>
			<div className="container alerts-container widedialog">
				<AlertByAddress />
				<AlertByCity />
				<MyAlerts />

			</div>
			<Snackbar
				open={added || deleted}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				autoHideDuration={3000}
				onClose={handleClose}
				onClick={handleClose}
				ContentProps={{
					'aria-describedby': 'message-id'
				}}
				message={
					<span id="message-id">{added? messages.alertAdded : messages.alertDeleted}</span>
				}
			/>
		</Wrapper>
	);
}

export default Alerts;