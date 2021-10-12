import React, { useState } from 'react';
import Wrapper from '../../components/Wrapper';
import Snackbar from '@material-ui/core/Snackbar';

import { CheckIfUserCanAccessPage } from 'hooks';
import api from 'services/api';
import './Alerts.css';
import AlertPlans from '../../components/AlertPlans';
import AlertTrees from '../../components/AlertTrees';
import AlertList from '../../components/AlertList';
import { AlertSection, AlertContainer } from './styles';

const messages = {
	alertAdded: 'התראת תכנון התווספה בהצלחה!',
	alertDeleted: 'התראת תכנון הוסרה בהצלחה'
}

const Alerts = () => {
	CheckIfUserCanAccessPage()

	const [added, setAdded] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [alerts, setAlerts] = useState([]);

	const handleCloseSnackbar = () => {
		setAdded(false);
		setDeleted(false);
	};

	const handleAddedAlert = () => {
		getAlerts();
		setAdded(true);
	};

	const handleDeletedAlert = () => {
		getAlerts();
		setDeleted(true);
	};

	const getAlerts = () => {
		return api.get('/alert')
			.then(result => {
				setAlerts(result.data);
			})
			.catch(error => console.error(error));
	}

	React.useEffect(() => {
		getAlerts();
	}, []);

	const planAlerts = <AlertSection gridArea='alert-plans'>
		<AlertPlans notifyAddedAlert={handleAddedAlert} />
	</AlertSection>;

	const treeAlrets = <AlertSection gridArea='alert-trees'>
		<AlertTrees notifyAddedAlert={handleAddedAlert} />
	</AlertSection>;

	const alertList = <AlertSection gridArea='alert-list' height='fit-content'>
		<AlertList notifyDeletedAlert={handleDeletedAlert} alerts={alerts} />
	</AlertSection>;

	return (<Wrapper>
		<AlertContainer>
			{planAlerts}
			{treeAlrets}
			{alertList}
		</AlertContainer>
		<Snackbar
			open={added || deleted}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			autoHideDuration={3000}
			onClose={handleCloseSnackbar}
			onClick={handleCloseSnackbar}
			ContentProps={{ 'aria-describedby': 'message-id' }}
			message={<span id="message-id">{added ? messages.alertAdded : messages.alertDeleted}</span>}
		/>
	</Wrapper>);
}

export default Alerts;