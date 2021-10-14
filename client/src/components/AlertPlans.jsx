import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import t, { useTranslation } from 'locale/he_IL';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useState } from 'react';
import api from 'services/api';

const sliderBounds = { min: 1, max: 10 };
const sliderText = {};
_.map(new Array(sliderBounds.max), (obj, i) => {
	sliderText[i + 1] = `${sliderBounds.max - i} ${t.km}`;
});

const AlertPlans = ({ notifyAddedAlert }) => {
	const { t } = useTranslation();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [radius, setRadius] = useState(5);
	const [address, setAddress] = useState('');

	const handleSlide = (value) => {
		setRadius(value);
		setError(false);
	};

	const handleAddress = (e) => {
		setAddress(e.target.value);
		setError(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoading(true);

		api.post('/alert', {
			address,
			// we make the calculation as the slider is LTR, and the value
			// is the opposite in RTL
			radius: sliderBounds.max + sliderBounds.min - radius,
			type: 'plan'
		}).then(() => {
			notifyAddedAlert();
		}).finally(() => {
			// reset values
			setLoading(false);
			setAddress('');
			setRadius(5);
		}).catch(error => {
			setError(error);
			console.error(error);
		});
	}

	return (
		<form onSubmit={handleSubmit}>
			<h5 className="container-title">{t.newAlert}</h5>
			{error && (
				<div className="alert alert-danger" role="alert">
					{t.noAddress}
				</div>
			)}
			<div className="selectAreaAndInterest">
				{t.alertsSubtitle}
				<small>
					{t.alertsSubtitleInfo}
				</small>
				<small>
					{t.alertsSubtitleInfo2}
				</small>
			</div>
			<div className="row">
				<div className="col">
					<label id="homeLabale">{t.address}:</label>
					<input
						id="homeAddress"
						type="text"
						value={address}
						placeholder={t.addressExample}
						required
						onChange={handleAddress}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label id="radiusLabale">{t.radius}:</label>
					<Slider
						min={sliderBounds.min}
						max={sliderBounds.max}
						onChange={handleSlide}
						marks={sliderText}
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
						defaultValue={radius}
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
						disabled={loading}
					>
						{t.addition}
						{loading && (
							<FontAwesomeIcon icon="spinner" spin />
						)}
					</button>
				</div>
			</div>
		</form>
	);
}

AlertPlans.propTypes = {
	notifyAddedAlert: PropTypes.func.isRequired
};

export default AlertPlans;
