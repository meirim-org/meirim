import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './scenes/Home/Home';
import Plans from './scenes/Plans';
import SinglePlan from './scenes/SinglePlan';
import Activate from './scenes/Activate';
import Alerts from './scenes/Alerts';
import AlertUnsubscribe from './scenes/AlertUnsubscribe';
import ForgotPassword from './scenes/ForgotPassword';
import About from './scenes/About';
import Terms from './scenes/Terms';
import Vocabulary from './scenes/Vocabulary';
import NotFound from './scenes/NotFound';
import EmailSent from './pages/Register/emailSent';
import api from './services/api';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faSpinner,
	faTimes,
	faBuilding,
	faPaperPlane,
	faChartArea
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; 
import './assets/bootstrap.css';

library.add(faSpinner, faTimes, faBuilding, faPaperPlane, faChartArea, faWhatsapp);


const App = () => {
	const [me, setMe] = React.useState(null)

	React.useEffect(() => {
		api.get('/me')
			.then(() => {
				setMe(true)
			})
			.catch(() => {
				setMe(false)
			})
	}, [])

	if (me === null) {
		return <div>Loading...</div>;
	}
	
	return (
		<React.Fragment>
			<Router>
				<div>
					<Switch>
						<Route
							exact
							path="/"
							render={props => <Home {...props} me={me} />}
						/>
						<Route
							path="/alerts/unsubscribe/:token"
							render={props => <AlertUnsubscribe {...props} me={me} />}
						/>
						<Route
							path="/alerts"
							render={props => <Alerts {...props} me={me} />}
						/>
						<Route
							path="/plan/:id/:title"
							render={props => <SinglePlan {...props} me={me} />}
						/>
						<Route
							path="/plan/:id"
							render={props => <SinglePlan {...props} me={me} />}
						/>
						<Route
							path="/plans"
							render={props => <Plans {...props} me={me} />}
						/>
						<Route
							path="/sign/up"
							render={props => <Home {...props} showRegister={true} me={me} />}
						/>
						<Route
							path="/sign/in"
							render={props => <Home {...props} setMe={setMe} showSignin={true} me={me} />}
						/>
						<Route
							path="/activate"
							render={props => <Activate {...props} me={me} />}
						/>
						<Route
							path="/forgot"
							render={props => (
								<ForgotPassword {...props} me={me} />
							)}
						/>
						<Route
							path="/vocabulary"
							render={props => <Vocabulary {...props} me={me} />}
						/>
						<Route
							path="/about"
							render={props => <About {...props} me={me} />}
						/>
						<Route
							path="/terms"
							render={props => <Terms {...props} me={me} />}
						/>
						<Route
							path="/404"
							render={props => <NotFound {...props} me={me} />}
						/>
						<Route
							path="/email-sent"
							render={props => <EmailSent {...props} me={me} />}
						/>
						<Route component={NotFound} />
					</Switch>
				</div>
			</Router>
			<ToastContainer autoClose={false}/>
		</React.Fragment>
	);
}

export default App;
