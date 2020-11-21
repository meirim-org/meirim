import React, { useState } from 'react';
import Hidden from '@material-ui/core/Hidden';
import api from '../../services/api';
import { NavLink } from 'react-router-dom';
import t from '../../locale/he_IL';
import logo from '../../assets/logo.png';
import styled from 'styled-components';
import { device } from '../../style';
import PropTypes from 'prop-types';
import { Button } from '../../shared';
import { Grid, Container, List, ListItem, Box } from '@material-ui/core';


const Logo = styled.img`
    max-width: 53px;
    height: auto;
`;

const StyledLink = styled(NavLink)`
    font-family: Assistant !important;
    font-size: 16px;
    color: #1a2d66;
    transition: 0.3s;

    &:hover, &.active {
        text-decoration: none;
        color: #652dd0;
    }
`;

const StyledHeader = styled.header`
    position: fixed;
    z-index: 999;
    background-color: #ffffff;
    padding: .75rem 0;
    border-bottom: 1px solid #e4e4e4;   
    top: 0;
    right: 0;
    left: 0;
`;

const StyledContainer = styled(Container)`
    max-width: 1376px !important;
`;

const StyledGridContainer = styled(Grid)`
    width: calc(100% + 2.4rem) !important;
    margin: 0 -1.2rem;
    > div {
        padding: 0 1.2rem;
    }
`;

const StyledGridContainerAlt = styled(Grid)`
    width: calc(100% + 1.5rem) !important;
    margin: 0 -0.75rem;
    > div {
        padding: 0 0.75rem;
    }
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
				<Grid container alignItems="center" justify="space-between">
					<Grid item>
						<StyledGridContainer container alignItems="center">
							<Grid item>
								<StyledLink to="/">
									<Logo src={logo} alt={t.name}/>
								</StyledLink>
							</Grid>
							<Grid item>
								<nav>
									<Box display="flex" alignItems="center">
										<Box px={2}>
											<StyledLink to="/plans/" activeClassName="active">
												{t.plans}
											</StyledLink>
										</Box>
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
									</Box>
								</nav>
							</Grid>
						</StyledGridContainer>
					</Grid>
					<Grid item>
						{me && (
							<StyledGridContainer container alignItems="center">
								<Grid item>
									<span>dropdown</span>
								</Grid>
							</StyledGridContainer>
						)}
						{!me && (
							<StyledGridContainerAlt container alignItems="center">
								<Grid item>
									<Button id="sing-in" text={t.signin} simple onClick={''}/>
								</Grid>
								<Grid item>
									<Button id="sing-up" text={t.signup} small altColor onClick={''}/>
								</Grid>
							</StyledGridContainerAlt>
						)}
					</Grid>
				</Grid>
			</StyledContainer>
		</StyledHeader>
	);

}

Navigation.propTypes = {
	me: PropTypes.object,
};


export default Navigation;
