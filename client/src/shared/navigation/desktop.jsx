import { Box, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTheme } from '@material-ui/styles';
import logo from 'assets/logo.png';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { openModal } from 'redux/modal/slice';
import { Button, Menu, Row } from 'shared';
import { StarIcon } from 'shared/icons';
import * as SC from './style';

const DesktopNavBar = ({ user, isAuthenticated, logoutHandler }) => {
    const theme = useTheme();
    const { t, changeLanguage, selectedLanguage } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [dropDownEl, setDropDownEl] = React.useState(null);
    const handleDropDownClick = (event) => {
        setDropDownEl(event.currentTarget);
    };
    const handleDropDownClose = () => {
        setDropDownEl(null);
    };
    const dropdownItems = [{ text: t.signout, onClick: logoutHandler }];

    return (
        <SC.DesktopHeader>
            <SC.StyledContainer>
                <Row justify="space-between">
                    <Box>
                        <Row gutter={1.2}>
                            <Box>
                                <SC.StyledLink id="nav-bar-logo" to="/">
                                    <SC.Logo src={logo} alt={t.name} />
                                </SC.StyledLink>
                            </Box>
                            <Box component="nav">
                                <Box display="flex" alignItems="center">
                                    <Box px={2}>
                                        <SC.StyledLink
                                            id="nav-bar-plans"
                                            to="/plans/"
                                            isActive={(match, location) =>
                                                location.pathname.includes(
                                                    '/plans'
                                                )
                                            }
                                        >
                                            {t.plans}
                                        </SC.StyledLink>
                                    </Box>
                                    <Box px={2}>
                                        <SC.StyledLink
                                            id="nav-bar-plans"
                                            to="/trees/"
                                            isActive={(match, location) =>
                                                location.pathname.includes(
                                                    '/trees'
                                                )
                                            }
                                        >
                                            {t.treePermits}
                                        </SC.StyledLink>
                                    </Box>
                                    <Box px={2}>
                                        {isAuthenticated && (
                                            <SC.StyledLink
                                                id="nav-bar-alerts"
                                                to="/alerts/"
                                            >
                                                {t.alerts}
                                            </SC.StyledLink>
                                        )}
                                        {!isAuthenticated && (
                                            <SC.StyledLink
                                                id="nav-bar-alerts"
                                                to="#"
                                                isActive={() => false}
                                                onClick={() => {
                                                    dispatch(
                                                        openModal({
                                                            modalType: 'login',
                                                        })
                                                    );
                                                }}
                                            >
                                                {t.alerts}
                                            </SC.StyledLink>
                                        )}
                                    </Box>
                                    <Box px={2}>
                                        <SC.StyledLink
                                            id="nav-bar-about"
                                            to={{
                                                pathname: '/support-us/',
                                                hash: 'who-we-are',
                                            }}
                                            isActive={(match, location) =>
                                                [
                                                    '/support-us',
                                                    '/support-us/',
                                                ].indexOf(location.pathname) >
                                                    -1 &&
                                                location.hash === '#who-we-are'
                                            }
                                        >
                                            {t.whoWeAre}
                                        </SC.StyledLink>
                                    </Box>
                                    <Box px={2}>
                                        <SC.StyledLink
                                            id="nav-bar-urban-planning"
                                            to="/urban-planning/"
                                        >
                                            {t.urbanPlanning}
                                        </SC.StyledLink>
                                    </Box>
                                    <Box px={2}>
                                        <Button
                                            id="support-us"
                                            text={t.supportUs}
                                            type={'primary'}
                                            onClick={() => {
                                                history.push('/support-us/');
                                            }}
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
                                    {selectedLanguage === 'HE' && (
                                        <Grid item>
                                            <Button
                                                id="change-lang-to-ar"
                                                text={'عربي'}
                                                fontWeight="400"
                                                simple
                                                onClick={() =>
                                                    changeLanguage('AR')
                                                }
                                            />
                                        </Grid>
                                    )}
                                    {selectedLanguage === 'AR' && (
                                        <Grid item>
                                            <Button
                                                id="sign-in"
                                                text={'עברית'}
                                                fontWeight="400"
                                                simple
                                                onClick={() =>
                                                    changeLanguage('HE')
                                                }
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid item>
                                    <SC.MyPlansButton
                                        component={Link}
                                        to={'/my-plans/'}
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
                                {selectedLanguage === 'HE' && (
                                    <Grid item>
                                        <Button
                                            id="change-lang-to-arab"
                                            text={'عربي'}
                                            fontWeight="400"
                                            simple
                                            onClick={() => changeLanguage('AR')}
                                        />
                                    </Grid>
                                )}
                                {selectedLanguage === 'AR' && (
                                    <Grid item>
                                        <Button
                                            id="change-lang-to-he"
                                            text={'עברית'}
                                            fontWeight="400"
                                            simple
                                            onClick={() => changeLanguage('HE')}
                                        />
                                    </Grid>
                                )}
                                <Grid item>
                                    <Button
                                        id="sign-in"
                                        text={t.signin}
                                        fontWeight="400"
                                        simple
                                        onClick={() =>
                                            dispatch(
                                                openModal({
                                                    modalType: 'login',
                                                })
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        id="sign-up"
                                        text={t.signup}
                                        small
                                        altColor
                                        onClick={() =>
                                            dispatch(
                                                openModal({
                                                    modalType: 'register',
                                                })
                                            )
                                        }
                                    />
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
