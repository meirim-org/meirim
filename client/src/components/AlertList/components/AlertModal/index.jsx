import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import t, { useTranslation } from 'locale/he_IL';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useState } from 'react';
import api from 'services/api';
import { UpgradeButton } from 'shared';
import RedLockIcon from 'shared/icons/RedLockIcon';
import { ModalActions } from 'redux/actions';
import * as SC from './style';
import { useDispatch } from 'react-redux';
import { setAlerts } from '../../../../redux/alerts/slice';
import { toast } from 'react-toastify';
import { closeModal, openModal } from 'redux/modal/slice';
import { UserSelectors } from '../../../../redux/selectors';
import { Link } from '../../../../shared';
import { useUpdateManuallyUserState } from '../../../../scenes/alerts/hooks';
import FilterAutoCompleteMultiple from '../../../FilterAutoCompleteMultiple';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const sliderBounds = { min: 1, max: 10 };
const sliderText = {};
_.map(new Array(sliderBounds.max), (obj, i) => {
	sliderText[i + 1] = `${sliderBounds.min + i} ${t.km}`;
});

const AlertModal = ({ type }) => {
	return type === 'tree' ? <TreeAlertModal /> : <PlanAlertModal />;
};

AlertModal.propTypes = {
	type: PropTypes.bool.isRequired,
};

export default AlertModal;

const TreeAlertModal = () => {
	const { t } = useTranslation();
	const { handleGetMe } = useUpdateManuallyUserState();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [selectedPlaces, setSelectedPlaces] = useState([]);
	const dispatch = useDispatch();
	const [treePlaces, setTreePlaces] = useState([]);

	useEffect(() => {
		if (selectedPlaces.length > 0) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [selectedPlaces]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			Promise.all(
				selectedPlaces.map((place) =>
					api.post('/alert', {
						place: place,
						radius: '1',
						type: 'tree',
					})
				)
			)
				.then(() => {
					toast.success('התראה נוספה בהצלחה');

					api.get('/alert').then((result) => {
						dispatch(
							setAlerts({
								list: result.data,
							})
						);
					});

					handleGetMe();
				})
				.catch((resp) => {
					const {
						response: { data },
					} = resp;
					toast.error(data.data);
				})
				.finally(() => {
					setLoading(false);
					dispatch(closeModal());
				});
		} catch (error) {
			setError(error);
			console.error(error.message);
			toast.error('Error');
		}
	};

	function handleFilterChange(placesFromFilter) {
		setSelectedPlaces(placesFromFilter);
	}

	useEffect(() => {
		async function fetchPlaces() {
			return api
				.get('/tree_place')
				.then((result) => {
					const formattedTreePlaces = result.data.map((tp) => {
						return { label: tp.place };
					});
					setTreePlaces(formattedTreePlaces);
				})
				.catch((error) => setError(error));
		}
		fetchPlaces();
	}, []);

	return (
		<SC.Form onSubmit={handleSubmit}>
			<div className="row row__heading">
				<div className="col">
					<h5 className="title">{t.addAlert}</h5>
					<p className="subtitle">{t.addCitiesToGetNotified}</p>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<FilterAutoCompleteMultiple
						classes="alertModal__input"
						placeholder="הזינו עיר, מועצה אזורית או רשות מקומית "
						inputSuggestions={treePlaces}
						onFilterChange={handleFilterChange}
					/>

					<div className="alertModal__inputPWrapper">
						<p>{t.citiesNotAva}</p>
						<p>
							<Link to="/support-us" text={t.supportUs} />{' '}
							{t.weCanCome}
						</p>
					</div>
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

			<div className="row">
				<div className="col">
					<div className="alertModal__buttonsWrapper">
						<button
							className="alertModal__button alertModal__button_cancel"
							disabled={loading}
							onClick={ModalActions().close}
						>
							{t.cancelation}
						</button>

						<button
							className="alertModal__button alertModal__button_submit"
							id="submitButton"
							disabled={loading || disabled}
							type="submit"
						>
							{t.addAlert}
							{loading && <FontAwesomeIcon icon="spinner" spin />}
						</button>
					</div>
				</div>
			</div>
		</SC.Form>
	);
};

const PlanAlertModal = () => {
	const { t } = useTranslation();
	const { handleGetMe } = useUpdateManuallyUserState();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [radius, setRadius] = useState(1);
	const [address, setAddress] = useState('');
	const dispatch = useDispatch();
	const { subscribe_plan_id } = UserSelectors().user;

	const handleSlide = (value) => {
		setRadius(value);
		setError(false);
	};

	const handleAddress = (e) => {
		setAddress(e.target.value);
		setError(false);
		if (e.target.value) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api
				.post('/alert', {
					address,
					place: '',
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
					<h5 className="title">{t.addAlert}</h5>
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
								<OverlayTrigger
									overlay={
										<Tooltip style={{ zIndex: '99999' }}>
											Upgrade to unlock radius
										</Tooltip>
									}
									placement="left"
								>
									<p style={{ margin: 0 }}>
										<RedLockIcon />
									</p>
								</OverlayTrigger>
							</p>
							<UpgradeButton
								variant="string"
								text={t.upgrade}
								onClick={() =>
									dispatch(
										openModal({
											modalType: 'upgradeModal',
											modalProps: {
												wrapperClass: 'upgradeModal',
											},
										})
									)
								}
							/>
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
							{t.cancelation}
						</button>

						<button
							className="alertModal__button alertModal__button_submit"
							id="submitButton"
							disabled={loading || disabled}
							type="submit"
						>
							{t.addAlert}
							{loading && <FontAwesomeIcon icon="spinner" spin />}
						</button>
					</div>
				</div>
			</div>
		</SC.Form>
	);
};
