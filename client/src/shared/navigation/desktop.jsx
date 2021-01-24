import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@material-ui/core';
import { StarIcon } from 'shared/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link, useHistory } from 'react-router-dom';
import t from 'locale/he_IL';
import logo from 'assets/logo.png';
import { Button, Row, Menu } from 'shared';
import * as SC from './style';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import { useTheme } from '@material-ui/styles';

const DesktopNavBar = ({ user, isAuthenticated, logoutHandler }) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const history = useHistory();
	const [dropDownEl, setDropDownEl] = React.useState(null);
	const handleDropDownClick = (event) => {
		setDropDownEl(event.currentTarget);
	};
	const handleDropDownClose = () => {
		setDropDownEl(null);
	};
	const dropdownItems = [{ 'text': t.signout, 'onClick': logoutHandler }];

	return (
		<SC.DesktopHeader>
			<SC.StyledContainer>
				<Row justify="space-between">
					<Box>
						<Row gutter={1.2}>
							<Box>
								<SC.StyledLink id='nav-bar-logo' to="/">
									<SC.Logo src={logo} alt={t.name}/>
								</SC.StyledLink>
							</Box>
							<Box component="nav">
								<Box display="flex" alignItems="center">
									<Box px={2}>
										<SC.StyledLink 
											id="nav-bar-plans"
											to="/plans/"
											isActive={(match, location) => location.pathname.includes('/plans')}
										>
											{t.plans}
										</SC.StyledLink>
									</Box>
									<Box px={2}>
										<SC.StyledLink 
											id="nav-bar-plans"
											to="/trees/"
											isActive={(match, location) => location.pathname.includes('/trees')}
										>
											{t.treePermits}
										</SC.StyledLink>
									</Box>
									<Box px={2}>
										{isAuthenticated && (
											<SC.StyledLink id="nav-bar-alerts" to="/alerts/">
												{t.alerts}
											</SC.StyledLink>
										)}
										{!isAuthenticated && (
											<SC.StyledLink id="nav-bar-alerts" to="#" isActive={() => false} onClick={() => { dispatch(openModal({ modalType: 'login' })); }}>
												{t.alerts}
											</SC.StyledLink>
										)}
									</Box>
									<Box px={2}>
										<SC.StyledLink
											id="nav-bar-about"
											to={{
												pathname: '/funding/',
												hash: 'who-we-are'
											}}
											isActive={(match, location) =>
												['/funding', '/funding/'].indexOf(location.pathname) > -1 &&
												location.hash === '#who-we-are'
											}
										>
											{t.whoWeAre}
										</SC.StyledLink>
									</Box>
									<Box px={2}>
										<Button
											id="support-us"
											text={t.supportUs}
											type={'primary'}
											onClick={() => { history.push(`/funding/`); }}
											small
										/>
									</Box>
								</Box>
							</Box>
						</Row>
					</Box>
					<Box>
						{isAuthenticated && (
							<Row>
								<Grid item>
									<SC.MyPlansButton
										component={Link} 
										to={`/my-plans/`}
										startIcon={<StarIcon />}
										aria-label={t.myPlans}
									>
										{t.myPlans}
									</SC.MyPlansButton>
								</Grid>
								<Grid item>
									<SC.MenuWrapper>
										<Menu
											ariaControls="user-menu"
											openHandler={handleDropDownClick}
											closeHandler={handleDropDownClose}
											textcolor={theme.palette.blue.main}
											iconAfter={<ExpandMoreIcon />}
											dropDownEl={dropDownEl}
											menuItems={dropdownItems}
											text={user && user.name}
										/>
									</SC.MenuWrapper>
								</Grid>
							</Row>
						)}
						{!isAuthenticated && (
							<Row gutter={0.75}>
								<Grid item>
									<Button id="sign-in" text={t.signin} 
										fontWeight="400" simple 
										onClick={() => dispatch(openModal({ modalType: 'login' }))}/>
								</Grid>
								<Grid item>
									<Button id="sign-up" text={t.signup} 
										small altColor 
										onClick={() => dispatch(openModal({ modalType: 'register' }))}/>
								</Grid>
							</Row>
						)}
					</Box>
				</Row>
			</SC.StyledContainer>
		</SC.DesktopHeader>
	);
};

DesktopNavBar.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	logoutHandler: PropTypes.func.isRequired,
	user: PropTypes.object,
};

export default DesktopNavBar;