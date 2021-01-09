import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, ListItemText, Divider, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import StarIcon from '@material-ui/icons/Star';
import t from 'locale/he_IL';
import { Row, IconButton, Button } from 'shared';
import logo from 'assets/logo.png';
import { colors } from 'style/index';
import * as SC from './style';
import { PLANS } from 'router/contants';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';

const MobileNavBar = ({ logoutHandler, isAuthenticated }) => {
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
                                        <SC.StyledLink id="nav-bar-plans" to="/my-plans/" activeClassName="active">
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
								<IconButton onClick={() => setMobileNavIsOpened(true)}  textcolor={colors.purple} ariaLabel={'open mobile menu'}>
									<MenuIcon/>
								</IconButton>
								<SC.Drawer open={mobileNavIsOpened}>
									<SC.MobileNavWrapper
										role="presentation"
									>
										<Box display="flex" justifyContent="flex-end" m={1.5}>
											<IconButton
												textcolor={colors.black}
												ariaLabel={'close mobile menu'}
												fontSize={20.5}
												onClick={() => setMobileNavIsOpened(false)}
											>
												<CloseIcon />
											</IconButton>
										</Box>

										<SC.StyledList>
											{isAuthenticated && (
												<SC.StyledListItem component={RouterLink} button key={t.myPlans}
													color="#652dd0">
													<ListItemText primary={t.myPlans}/>
													<SC.StyledStarIcon>
														<StarIcon/>
													</SC.StyledStarIcon>
												</SC.StyledListItem>
											)}
											<SC.StyledListItem component={RouterLink} to={PLANS} button key={t.plans}>
												<ListItemText primary={t.plans}/>
											</SC.StyledListItem>
										</SC.StyledList>
										<Divider/>
										<SC.StyledList>
											<SC.StyledListItem component={RouterLink} to="#" button key={t.supportUs}>
												<ListItemText primary={t.supportUs}/>
											</SC.StyledListItem>
										</SC.StyledList>
										<SC.StyledList>
											<SC.StyledListItem component={RouterLink} to="/about/" button key={t.whoWeAre}>
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
														key={t.signup}
														color="#652dd0">
														<ListItemText primary={t.signup}/>
													</SC.StyledListItem>
												</>
											)}
											{isAuthenticated && (
												<>
													<SC.StyledListItem component={RouterLink} to="#" button
														key={t.alerts}>
														<ListItemText primary={t.alerts}/>
													</SC.StyledListItem>
													<SC.StyledListItem component={RouterLink} to="#" button
														onClick={logoutHandler}
														key={t.signout}
														color="#b71f29">
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
	user: PropTypes.object,
	logoutHandler: PropTypes.func.isRequired,
};

export default MobileNavBar;
