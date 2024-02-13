import './assets/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faTimes, faBuilding,
	faPaperPlane, faChartArea
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as Scenes from 'scenes';
import Plan from 'pages/Plan';
import UserPlans from 'pages/UserPlans';
import Tree from 'pages/Tree';
import EmailSent from 'pages/Register/emailSent';
import Homepage from 'pages/Homepage';
import Funding from 'pages/Funding';
import FundingSuccess from 'pages/Funding/success';
import UrbanPlanning from 'pages/UrbanPlanning';
import Permits from 'pages/Permits'
import { Modal, CircularProgress } from 'shared';
import 'App.css';
import { muiTheme } from 'theme';
import { CookieHook, useInitGA, useInitHotjar } from 'hooks';
import AOI from 'pages/Permits/AOI';

library.add(
    faSpinner,
    faTimes,
    faBuilding,
    faPaperPlane,
    faChartArea,
    faWhatsapp
)
let basename = "/";

if (process.env.CONFIG.basename) {
	basename = process.env.CONFIG.basename
}

const App = (props) => {
	// initialize analytics
	useInitGA();
	useInitHotjar();

	const { loading } = CookieHook();
	if (loading) {
		return  <CircularProgress />; 
	}

	return (
		<MuiThemeProvider theme={muiTheme}>
			<BrowserRouter basename={basename}>
				<>
					<Modal />
					<Switch>
						<Route path="/" exact component={Homepage} />
						<Route path="/index.html" exact component={Homepage} />
						<Route path="/#login" render={props => <Homepage {...props} />} />
						<Route path="/alerts/unsubscribe/:token" 
							render={props => <Scenes.AlertUnsubscribe {...props} />} />
						<Route path="/alerts" render={props => <Scenes.Alerts {...props} />} />
						<Route path="/plan/:id" render={props => <Plan {...props} />} />
						<Route path="/my-plans" render={props => <UserPlans {...props} />} />
						<Route path="/plans" render={props => <Scenes.Plans {...props} />} />
						<Route path="/activate" render={props => <Scenes.Activate {...props} />} />
						<Route path="/forgot" render={props => (<Scenes.ForgotPassword {...props} />)} />
						<Route path="/support-us/success" render={props => (<FundingSuccess {...props} />)} />
						<Route path="/support-us" render={props => (<Funding {...props} />	)} />
						<Route path="/vocabulary" render={props => <Scenes.Vocabulary {...props} />} />
						<Route path="/about" render={props => <Scenes.About {...props} />} />
						<Route path="/trees" render={props => <Scenes.TreePermits {...props} />}/>
                        <Route path="/trees-map" render={props => <Scenes.TreePermitsMap {...props} />}/>
                        <Route path="/tree/:id" render={props => <Tree {...props} />} />
						<Route path="/terms" render={props => <Scenes.Terms {...props} />} />
						<Route path="/privacy-policy" render={props => <Scenes.PrivacyPolicy {...props} />} />
						<Route path="/404" render={props => <Scenes.NotFound {...props} />} />
						<Route path="/email-sent" render={props => <EmailSent {...props} />} />
						<Route path="/hub" render={props => <UrbanPlanning {...props}/>} />
						<Route path="/permits/aoi" render={props => <AOI {...props} />} />
						<Route path="/permits" render={props => <Permits {...props} />} />
						<Route component={Scenes.NotFound} />
					</Switch>
				</>
			</BrowserRouter>
			<ToastContainer autoClose={3000} />
		</MuiThemeProvider>
	);
};

export default App;
