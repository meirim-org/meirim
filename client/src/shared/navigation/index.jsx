import React, { useState } from 'react';
import api from '../../services/api';
import { NavLink } from 'react-router-dom';
import t from '../../locale/he_IL';
import logo from '../../assets/logo.png';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Row, Icon } from '../../shared';
import { Grid, Container, Box, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { colors } from '../../style/index'

const Logo = styled.img`
    max-width: 53px;
    height: auto;
`;

const StyledLink = styled(NavLink)`
    font-family: Assistant !important;
    font-size: 16px;
    color: ${colors.black};
    transition: 0.3s;

    &:hover, &.active {
        text-decoration: none;
        color: ${colors.purple};
    }
`;

const StyledHeader = styled.header`
    position: fixed;
    z-index: 999;
    background-color: ${colors.white};
    padding: .75rem 0;
    border-bottom: 1px solid ${colors.gray.light};   
    top: 0;
    right: 0;
    left: 0;
`;

const StyledContainer = styled(Container)`
    max-width: 1376px !important;
`;

const Navigation = ({ me }) => {
	const [signOutSuccess, setSignOutSuccess] = useState(false);

	const signOut = () => {
		api.post('/sign/out').then((signOutSuccess) => {
			window.location = '/';
		});
	}

	return (
		<StyledHeader>
			<StyledContainer>
				<Row justify="space-between">
					<Box>
						<Row gutter={1.2}>
							<Box>
								<StyledLink to="/">
									<Logo src={logo} alt={t.name}/>
								</StyledLink>
							</Box>
							<Box component="nav">
								<Box display="flex" alignItems="center">
									<Box px={2}>
										<StyledLink to="/plans/" activeClassName="active">
											{t.plans}
										</StyledLink>
									</Box>
									<Hidden smDown>
										<Box px={2}>
											<StyledLink to="/alerts/" activeClassName="active">
												{t.alerts}
											</StyledLink>
										</Box>
										<Box px={2}>
											<StyledLink to="/about/" activeClassName="active">
												{t.about}
											</StyledLink>
										</Box>
										<Box px={2}>
											<Button id="support-us" text={t.supportUs} type={'primary'} onClick={''} small/>
										</Box>
									</Hidden>
								</Box>
							</Box>
						</Row>
					</Box>
					<Box>
						<Hidden mdUp>
							<Icon color="red" ariaLabel={'open mobile menu'}>
								<MenuIcon />
							</Icon>
						</Hidden>

						<Hidden smDown>
							{me && (
								<Row>
									<Grid item>
										<span>dropdown</span>
									</Grid>
								</Row>
							)}
							{!me && (
								<Row gutter={0.75}>
									<Grid item>
										<Button id="sing-in" text={t.signin} simple onClick={''}/>
									</Grid>
									<Grid item>
										<Button id="sing-up" text={t.signup} small altColor onClick={''}/>
									</Grid>
								</Row>
							)}
						</Hidden>
					</Box>
				</Row>
			</StyledContainer>
		</StyledHeader>
	);

}

Navigation.propTypes = {
	me: PropTypes.object,
};


export default Navigation;
