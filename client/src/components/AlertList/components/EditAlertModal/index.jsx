import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import t, { useTranslation } from 'locale/he_IL';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useState } from 'react';
import api from 'services/api';
import { UpgradeButton } from 'shared';
import RedLockIcon from 'shared/icons/RedLockIcon';
import { ModalActions } from 'redux/actions';
import * as SC from './style';
import { useDispatch } from 'react-redux';
import { setAlerts } from '../../../../redux/alerts/slice';
import { toast } from 'react-toastify';
import { closeModal } from 'redux/modal/slice';
import { UserSelectors } from '../../../../redux/selectors';
import { useUpdateManuallyUserState } from '../../../../scenes/alerts/hooks';

const sliderBounds = { min: 1, max: 10 };
const sliderText = {};
_.map(new Array(sliderBounds.max), (obj, i) => {
	sliderText[i + 1] = `${sliderBounds.min + i} ${t.km}`;
});

const EditAlertModal = ({ alertId, alertRadius, alertAddress }) => {
	return (
		<PlanAlertModal
			alertId={alertId}
			alertRadius={alertRadius}
			alertAddress={alertAddress}
		/>
	);
};

EditAlertModal.propTypes = {
	type: PropTypes.bool.isRequired,
};

export default EditAlertModal;

const PlanAlertModal = ({ alertId, alertRadius, alertAddress }) => {
	const { t } = useTranslation();
	const { handleGetMe } = useUpdateManuallyUserState();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [radius, setRadius] = useState(alertRadius);
	const [address, setAddress] = useState(alertAddress);
	const dispatch = useDispatch();
	const { subscribe_plan_id } = UserSelectors().user;

	const handleSlide = (value) => {
		setRadius(value);
		setError(false);
	};

	const handleAddress = (e) => {
		setAddress(e.target.value);
		setError(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api
				.post(`/alert/${alertId}/edit`, {
					address,
					radius: subscribe_plan_id ? radius.toString() : '1',
					type: 'plan',
				})
				.then(() => {
					toast.success('התראה נוספה בהצלחה');
					handleGetMe();
				})
				.catch((resp) => {
					const {
						response: { data },
					} = resp;
					// setError(data.data);
					toast.error(data.data);
				});

			await api.get('/alert').then((result) => {
				dispatch(
					setAlerts({
						list: result.data,
					})
				);
			});
		} catch (error) {
			setError(error);
			console.error(error.message);
			toast.error('Error');
		} finally {
			// reset values
			setLoading(false);
			setAddress('');
			setRadius(1);
			dispatch(closeModal());
		}
	};

	return (
		<SC.Form onSubmit={handleSubmit} radius={radius}>
			<div className="row row__heading">
				<div className="col">
					<h5 className="title">{t.editPlan}</h5>
					<p className="subtitle">{t.addResidentialAddress}</p>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<label className="alertModal__label" id="homeLabale">
						{t.address}:
					</label>

					<input
						className="alertModal__input"
						id="homeAddress"
						type="text"
						value={address}
						placeholder={t.addressExample}
						required
						onChange={handleAddress}
					/>
				</div>
			</div>

			{error && (
				<div className="row">
					<div className="col">
						<div className="alert alert-danger" role="alert">
							{t.noAddress}
						</div>
					</div>
				</div>
			)}

			{subscribe_plan_id ? (
				<div className="row row__radiusSection">
					<div className="col">
						<label className="alertModal__label" id="radiusLabale">
							{t.radius}:
						</label>
						<div className="alertModal__slider">
							<Slider
								min={sliderBounds.min}
								max={sliderBounds.max}
								onChange={handleSlide}
								marks={sliderText}
								reverse={true}
								trackStyle={[
									{
										backgroundColor: '#5314AD',
									},
								]}
								handleStyle={[
									{
										backgroundColor: '#5314AD',
										border: 'none',
									},
								]}
								railStyle={{
									backgroundColor: '#CFABFA',
								}}
								dots={true}
								dotStyle={{
									borderColor: '#CFABFA',
								}}
								activeDotStyle={{
									borderColor: '#5314AD',
								}}
								defaultValue={radius}
								value={radius}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="row row__fixedRadiusSection">
					<div className="col">
						<div className="alertModal__flex">
							<p className="alertModal__radiusLock">
								<b>רדיוס:</b> <span>1 ק״מ</span>
								<RedLockIcon />
							</p>
							<UpgradeButton variant="string" text={t.upgrade} />
						</div>
					</div>
				</div>
			)}

			<div className="row">
				<div className="col">
					<div className="alertModal__buttonsWrapper">
						<button
							className="alertModal__button alertModal__button_cancel"
							disabled={loading}
							onClick={ModalActions().close}
						>
							ביטול
						</button>

						<button
							className="alertModal__button alertModal__button_submit"
							id="submitButton"
							disabled={loading}
							type="submit"
						>
							הוספת התראה
							{loading && <FontAwesomeIcon icon="spinner" spin />}
						</button>
					</div>
				</div>
			</div>
		</SC.Form>
	);
};
