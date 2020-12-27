import './assets/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faTimes, faBuilding, 
	faPaperPlane, faChartArea
} from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as Scenes from 'scenes'
import EmailSent from 'pages/Register/emailSent';
import Modal from 'shared/modal'
import 'App.css';
import { muiTheme } from 'theme'
import { CookieHook } from 'hooks'

library.add(faSpinner, faTimes, faBuilding, faPaperPlane, faChartArea, faWhatsapp);

const CircularWrapper = styled.div`
	display: grid;
	justify-content: center;
	padding-top: 40%;
`
const App = () => {
	const { loading, success } = CookieHook()
	if (loading) {
		return <CircularWrapper> <CircularProgress /></CircularWrapper>
	}

	const openRegister = !success

	return (
		<MuiThemeProvider theme={muiTheme}>
			<BrowserRouter>
				<div>
					<Modal />
					<Switch>
						<Route exact path="/" render={props => <Scenes.Home {...props} openRegister={openRegister} />}	/>
						<Route path="/alerts/unsubscribe/:token" 
							render={props => <Scenes.AlertUnsubscribe {...props} />} />
						<Route path="/alerts" render={props => <Scenes.Alerts {...props} />} />
						<Route path="/plan/:id/:title" render={props => <Scenes.SinglePlan {...props} />} />
						<Route path="/plan/:id" render={props => <Scenes.SinglePlan {...props} />} />
						<Route path="/plans" render={props => <Scenes.Plans {...props} />} />
						<Route path="/activate" render={props => <Scenes.Activate {...props} />} />
						<Route path="/forgot" 	render={props => (<Scenes.ForgotPassword {...props} />	)} />
						<Route path="/vocabulary" render={props => <Scenes.Vocabulary {...props} />} />
						<Route path="/about" render={props => <Scenes.About {...props} />} />
						<Route path="/trees" render={props => <Scenes.TreePermits {...props} />}/>
						<Route path="/terms" render={props => <Scenes.Terms {...props} />} />
						<Route path="/404" render={props => <Scenes.NotFound {...props} />} />
						<Route path="/email-sent" render={props => <EmailSent {...props} />} />
						<Route component={Scenes.NotFound} />
					</Switch>
				</div>
			</BrowserRouter>
			<ToastContainer autoClose={false}/>
		</MuiThemeProvider>
	);
}

export default App;
