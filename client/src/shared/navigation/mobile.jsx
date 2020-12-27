import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, ListItemText, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { StarIcon } from 'shared/icons';
import t from 'locale/he_IL';
import { Row, IconButton, Button } from 'shared';
import logo from 'assets/logo.png';
import * as SC from './style';
import { PLANS, TREE_PERMITS } from 'router/contants';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/styles';

const MobileNavBar = ({ logoutHandler, isAuthenticated }) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [mobileNavIsOpened, setMobileNavIsOpened] = useState(false);


	return (
		<SC.MobileHeader>
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
									{isAuthenticated &&
                                        <SC.StyledLink id="nav-bar-plans" to={() => `/my-plans/`} activeClassName="active">
                                        	{t.myPlans}
                                        </SC.StyledLink>
									}
								</Box>
							</Box>
						</Row>
					</Box>
					<Box>
						<Row gutter={0.15}>
							{!isAuthenticated &&
                            <Box>
                            	<Button id="sign-up" text={t.signup}
                            		small altColor
                            		onClick={() => dispatch(openModal({ modalType: 'register' }))}/>
                            </Box>
							}
							<Box>
								<IconButton
									onClick={() => setMobileNavIsOpened(true)}
									color="primary"
									ariaLabel={'open mobile menu'}>
									<MenuIcon/>
								</IconButton>
								<SC.Drawer open={mobileNavIsOpened} anchor="right">
									<SC.MobileNavWrapper
										role="presentation"
									>
										<Box display="flex" justifyContent="flex-end" m={1.5}>
											<IconButton
												ariaLabel={'close mobile menu'}
												fontSize={20.5}
												onClick={() => setMobileNavIsOpened(false)}
											>
												<CloseIcon />
											</IconButton>
										</Box>

										<SC.StyledList>
											{isAuthenticated && (
												<SC.StyledListItem
													component={RouterLink}
													color="#652dd0" 
													to={() => `/my-plans/`}
													button
													key={t.myPlans}
													id="my-plans-button">
													<ListItemText primary={t.myPlans}/>
													<SC.StyledStarIcon>
														<StarIcon/>
													</SC.StyledStarIcon>
												</SC.StyledListItem>
											)}
											<SC.StyledListItem component={SC.StyledLink} to={PLANS} button key={t.plans}>
												<ListItemText primary={t.plans}/>
											</SC.StyledListItem>
											<SC.StyledListItem component={RouterLink} to={TREE_PERMITS} button key={t.treePermits}>
												<ListItemText primary={t.treePermits}/>
											</SC.StyledListItem>
										</SC.StyledList>
										<Divider/>
										<SC.StyledList>
											<SC.StyledListItem
												component={SC.StyledLink}
												to="/funding/"
												isActive={(match, location) =>
													['/funding', '/funding/'].indexOf(location.pathname) > -1 &&
													location.hash !== '#who-we-are'
												}
												button
												key={t.supportUs}
											>
												<ListItemText primary={t.supportUs}/>
											</SC.StyledListItem>
										</SC.StyledList>
										<SC.StyledList>
											<SC.StyledListItem
												component={SC.StyledLink}
												to={{
													pathname: '/funding/',
													hash: 'who-we-are'
												}}
												isActive={(match, location) =>
													['/funding', '/funding/'].indexOf(location.pathname) > -1 &&
													location.hash === '#who-we-are'
												}
												button
												key={t.whoWeAre}
											>
												<ListItemText primary={t.whoWeAre}/>
											</SC.StyledListItem>
										</SC.StyledList>
										<Divider/>
										<SC.StyledList>
											{!isAuthenticated && (
												<>
													<SC.StyledListItem component={SC.StyledLink} to="#" button
														onClick={() => {
															setMobileNavIsOpened(false);
															dispatch(openModal({ modalType: 'login' }));
														}}
														key={t.signin}>
														<ListItemText primary={t.signin}/>
													</SC.StyledListItem>
													<SC.StyledListItem component={RouterLink} to="#" button
														onClick={() => {
														    dispatch(openModal({ modalType: 'register' }));
															setMobileNavIsOpened(false);
														}}
														id="register-button"
														key={t.signup}
														color={theme.palette.primary.main}>
														<ListItemText primary={t.signup}/>
													</SC.StyledListItem>
												</>
											)}
											{isAuthenticated && (
												<>
													<SC.StyledListItem component={SC.StyledLink} to="/alerts/" button
														key={t.alerts}>
														<ListItemText primary={t.alerts}/>
													</SC.StyledListItem>
													<SC.StyledListItem
														component={RouterLink}
														to="#"
														button
														onClick={logoutHandler}
														key={t.signout}
														id='logout-button'
													>
														<ListItemText primary={t.signout}/>
														<SC.LogOutIcon>
															<InboxIcon/>
														</SC.LogOutIcon>
													</SC.StyledListItem>
												</>
											)}
										</SC.StyledList>
									</SC.MobileNavWrapper>
								</SC.Drawer>
							</Box>
						</Row>
					</Box>
				</Row>
			</SC.StyledContainer>
		</SC.MobileHeader>
	);
};

MobileNavBar.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	logoutHandler: PropTypes.func.isRequired,
};

export default MobileNavBar;
