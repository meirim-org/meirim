import '../../node_modules/leaflet/dist/leaflet.css';
import 'rc-slider/assets/index.css';
import React from 'react';
import PropTypes from 'prop-types'
import { Map, TileLayer, Circle } from 'react-leaflet';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import leaflet from 'leaflet';
import Wrapper from '../components/Wrapper';
import AlertTable from '../components/AlertTable';
import Slider from 'rc-slider';
import Snackbar from '@material-ui/core/Snackbar';
import api from 'services/api';
import t from 'locale/he_IL';
import { CheckIfUserCanAccessPage } from 'hooks'
import './Alerts.css';

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

	React.useEffect(() => {
		const sliderText = {};
		_.map(new Array(state.slider.max), (obj, i) => {
			sliderText[i + 1] = `${state.slider.max - i} ${t.km}`;
		});
		setState(pv => ({ ...pv, sliderText }))
		getAlerts();
		document.getElementById('homeAddress').focus();
	}, [state.slider.max])

	const getAlerts = () => {

		return api
			.get('/alert')
			.then(result => {
				let transparentLayer = leaflet.geoJSON();
				if (result.data.length > 0) {
					result.data.map(alert =>
						leaflet.geoJSON(alert.geom).addTo(transparentLayer)
					);
					const layerBounds = transparentLayer.getBounds();
					setState(pv => ({ ...pv,
						bounds: [
							layerBounds._southWest,
							layerBounds._northEast
						],
						alerts: result.data
					}));
				}
			})
			.catch(error => setState(pv => ({ ...pv, error })));
	}
    
	const handleSlide = (value)  =>{
		const { form } = state;
		form.radius = value;
		setState(pv => ({ ...pv, form, error: false }));
	}

	const handleAddress = (e) => {
		const { form } = state;
		form.address = e.target.value;

		setState( pv => ({ ...pv, form, error: false }));
	}

	const handleSubmit = (e)  =>{
		const { address, radius } = state.form;
		e.preventDefault();

		setState(pv => ({ ...pv,  loading: true }));

		api.post('/alert', {
			address,
			// we make the calculation as the slider is LTR, and the value
			// is the opposite in RTL
			radius: state.slider.max + state.slider.min - radius
		})
			.then(() => {
				getAlerts()
				setState( pv => ({ ...pv, added: true }))
			})
			.finally(() => {
				setState( pv => ({
					...pv,
					loading: false,
					form: {
						radius: 3,
						address: ''
					}
				}));
			})
			.catch(error => {
				setState(pv => ({ ...pv, error }));
				console.error(error);
			});
	}

	const handleDelete = (alertId) => {
		api.delete('/alert/' + alertId).then(() => {
			getAlerts()
			setState(pv =>({ ...pv, deleted: true }))
		});
	}
    
	const handleClose = () => {
		setState(pv => ({
			...pv, 
			added: false,
			deleted: false
		}));
	};
    
	const { alerts, form, error, bounds, added, deleted } = state;

	return (
		<Wrapper>

			<div className="container alerts-container widedialog">
				<form className="rectangle" onSubmit={handleSubmit}>
					<h5 className="container-title">{t.newAlert}</h5>
					{error && (
						<div className="alert alert-danger" role="alert">
                                הכתובת לא נמצאה
						</div>
					)}
					<div className="selectAreaAndInterest">
                            כדי לקבל התראות רלבנטיות הזינו כתובת ורדיוס
						<small>
                                *כתובת מגורים, שיש בה דירה בבעלותכם, או כל כתובת
                                שיש לכם עניין לגבי הסביבה שלה
						</small>
						<small>**ניתן להוסיף יותר מכתובת אחת</small>
					</div>
					<div className="row">
						<div className="col">
							<label id="homeLabale">כתובת:</label>
							<input
								id="homeAddress"
								type="text"
								value={form.address}
								placeholder='לדוגמא: מאז"ה 9, תל אביב'
								required
								onChange={handleAddress}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<label id="radiusLabale">רדיוס:</label>
							<Slider
								min={state.slider.min}
								max={state.slider.max}
								onChange={handleSlide}
								marks={state.sliderText}
								trackStyle={[
									{
										backgroundColor: 'gray'
									}
								]}
								handleStyle={[
									{
										backgroundColor: 'blue',
										border: '1px solid blue'
									}
								]}
								railStyle={{
									backgroundColor: 'blue'
								}}
								dots={true}
								defaultValue={form.radius}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<br />
							<br />
							<button
								id="submitButton"
								title="הוסף התראה"
								disabled={state.loading}
							>
                                    הוספה
								{state.loading && (
									<FontAwesomeIcon icon="spinner" spin />
								)}
							</button>
						</div>
					</div>
				</form>

				<div className="rectangle">
					<h5 className="container-title">ההתראות שלי</h5>
					<div className="row">
						<div className="col col-sm-6">
							<AlertTable
								alerts={alerts}
								onDelete={handleDelete}
							/>
						</div>
						<div className="col col-sm-6">
							{alerts.length > 0 && (
								<Mapa alerts={alerts} bounds={bounds} />
							)}
						</div>
					</div>
				</div>
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

function Mapa(props) {
	return (
		<Map
			bounds={props.bounds}
			style={{
				height: '300px',
				width: '100%'
			}}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			/>
			{props.alerts.map((alert, idx) => {
				let center = leaflet
					.geoJSON(alert.geom)
					.getBounds()
					.getCenter();
				
				return (
					<Circle
						radius={alert.radius * 1000}
						center={center}
						key={idx}
					/>
				);
			})}
		</Map>
	);
}

Mapa.propTypes = {
	alerts: PropTypes.array,
	bounds: PropTypes.array
}

export default Alerts;