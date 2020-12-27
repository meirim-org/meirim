import '../../node_modules/leaflet/dist/leaflet.css';
import 'rc-slider/assets/index.css';
import React from 'react';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slider from 'rc-slider';
import api from 'services/api';
import t from 'locale/he_IL';
import { CheckIfUserCanAccessPage } from 'hooks';


const initialBounds = [{ lat: 35, lng: 35 }, { lat: 25,lng: 25 }]
const initialSlider = { min: 1, max: 10 }

const AlertByAddress = () => {
	
	CheckIfUserCanAccessPage();
	
	const [state, setState] = React.useState({ 
		error: false, loading: false, alerts: [], added: false,
		deleted: false, form: { radius: 5, address: '' }, bounds: initialBounds ,
		slider: initialSlider, sliderText: {} 
	});

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
				//getAlerts()
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

	const { form, error } = state;

	
	return (
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
	)
}

export default AlertByAddress;