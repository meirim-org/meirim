import React from 'react';
import { Grid, Box, Hidden } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import t from 'locale/he_IL';
import logo from 'assets/logo.png';
import { Button, Row, IconButton, Menu } from 'shared';
import { colors } from 'style/index'
import { UserSelectors } from 'redux/selectors'
import { logout } from 'services/user'
import * as SC from './style'
import { useDispatch } from 'react-redux';
import { notAuthenticated } from 'redux/user/slice';
import { openModal } from 'redux/modal/slice';

const DesktopNavBar = () => {
	const dispatch = useDispatch()
	const [dropDownEl, setDropDownEl] = React.useState(null);
	const { isAuthenticated, user } = UserSelectors()
	const handleDropDownClick = (event) => {
		setDropDownEl(event.currentTarget);
	};
	const handleDropDownClose = () => {
		setDropDownEl(null);
	};
	const logoutHandler = async () => {
		const response = await logout()
		if (response.status === 'OK') dispatch(notAuthenticated())
	}
	
	return (
		<SC.StyledHeader>
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
										<SC.StyledLink id="nav-bar-plans" to="/plans/" activeClassName="active">
											{t.plans}
										</SC.StyledLink>
									</Box>
									<Hidden smDown>
										<Box px={2}>
											<SC.StyledLink id="nav-bar-alerts" to="/alerts/" activeClassName="active">
												{t.alerts}
											</SC.StyledLink>
										</Box>
										<Box px={2}>
											<SC.StyledLink id="nav-bar-about" to="/about/" activeClassName="active">
												{t.about}
											</SC.StyledLink>
										</Box>
										<Box px={2}>
											<Button id="support-us" text={t.supportUs} type={'primary'} onClick={() => {}}
												small/>
										</Box>
									</Hidden>
								</Box>
							</Box>
						</Row>
					</Box>
					<Box>
						<Hidden smDown>
							{isAuthenticated && (
								<Row>
									<Grid item>
										<RouterLink id="mobile-nav-bar-close-menu">
											<IconButton
												color={colors.purple}
												ariaLabel={'close mobile menu'}
												fontSize={20.5}
											>
												<BookmarkBorderIcon/>
											</IconButton>
										</RouterLink>
									</Grid>
									<Grid item>
										<Menu
											ariaControls="user-menu"
											openHandler={handleDropDownClick}
											closeHandler={handleDropDownClose}
											textColor="#1a2d66"
											iconBefore={<AccountCircleIcon color="primary"/>}
											iconAfter={<ExpandMoreIcon color="secondary"/>}
											dropDownEl={dropDownEl}
											menuItems={[
												{
													'text': 'התנתק',
													'onClick': logoutHandler

												},
											]}
											text={user && user.name}
										/>
									</Grid>
								</Row>
							)}
							{!isAuthenticated && (
								<Row gutter={0.75}>
									{/* <Grid item>
										<Link id="registered-nav-bar-starred" to="/" withIcon={true}>
											<SC.StyledStarIcon>
												<StarIcon/>
											</SC.StyledStarIcon>
											<ListItemText primary={t.myPlans}/>
										</Link>
									</Grid> */}
									<Grid item>
										<Button id="sing-in" text={t.signin} fontWeight="400" simple onClick={() => dispatch(openModal({ modalType: 'login' }))}/>
									</Grid>
									<Grid item>
										<Button id="sing-up" text={t.signup} small altColor onClick={() => dispatch(openModal({ modalType: 'register' }))}/>
									</Grid>
								</Row>
							)}
						</Hidden>
					</Box>
				</Row>
			</SC.StyledContainer>
		</SC.StyledHeader>
	);
}

export default DesktopNavBar;
