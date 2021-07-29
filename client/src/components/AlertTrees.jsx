import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'shared';
import FilterAutoCompleteMultiple from '../components/FilterAutoCompleteMultiple';
import api from '../services/api';

const AlertTrees = ({notifyAddedAlert}) => {
	const [ error, setError ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ treePlaces, setTreePlaces ] = useState([]);
	const [ selectedPlaces, setSelectedPlaces ] = useState([]);
	const { t } = useTranslation();

	function handleFilterChange(placesFromFilter) {
		setSelectedPlaces(placesFromFilter);
	}

	React.useEffect(() => {
		async function fetchPlaces() {
			return api.get('/tree_place')
				.then(result => {
					const formattedTreePlaces = result.data.map(tp => {
						return { label: tp.place };
					});
					setTreePlaces(formattedTreePlaces);
				})
				.catch(error => setError(error));
		};
		fetchPlaces();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoading(true);

		Promise.all(
			selectedPlaces.map(place => api.post('/alert', {
				place: place,
				type: 'tree'
			}))
		).then(() => {
			notifyAddedAlert();
		}).catch(error => {
			setError(error);
			console.error(error);
		}).finally(() => {
			setLoading(false);
			setSelectedPlaces([]);
		});
	}

	return (
		<>
			<form className="rectangle" onSubmit={handleSubmit}>
			{error && <div className="error-container">{error}</div>}

				<h5 className="container-title">{t.newAlertTree}</h5>
				{error && (
					<div className="alert alert-danger" role="alert">
						התרחשה תקלה, אנא נסו שוב
					</div>
				)}
				<div className="selectAreaAndInterest">
					הוסיפו את הערים עליהם תרצו לקבל התראה
					<small>
						**ניתן להוסיף יותר מעיר אחת
					</small>
				</div>

				<FilterAutoCompleteMultiple
					classes=""
					placeholder="הזינו עיר, מועצה אזורית או רשות מקומית "
					inputSuggestions={treePlaces}
					onFilterChange={handleFilterChange}
				/>
				<br />

				<div> * ישנן רשויות שלא זמינות לנו כרגע</div>
				<div> <Link url="/support-us/" textDecoration="none" text="תמכו בנו" /> כדי שנוכל להגיע גם לעיר שלכם!</div>
				<div className="row">
					<div className="col">
						<br />
						<button
							id="submitButton"
							title="הוסף התראה"
							disabled={loading}
						>
							הוספה
							{loading && (
								<FontAwesomeIcon icon="spinner" spin />
							)}
						</button>
					</div>
				</div>
			</form>
		</>
	);
}

AlertTrees.propTypes = {
	notifyAddedAlert: PropTypes.func.isRequired
};

export default AlertTrees;
