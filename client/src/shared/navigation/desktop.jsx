import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import t from '../../locale/he_IL';
import logo from '../../assets/logo.png';
import PropTypes from 'prop-types';
import { Button, Row, IconButton, Menu, Link } from '../../shared';
import {
	Grid,
	Box,
	Hidden,
	ListItemText,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import * as SC from './style'
import { colors } from '../../style/index'
import { userLoggedInMenuItems } from './constants'

const DesktopNavBar = ({ me }) => {
	const [dropDownEl, setDropDownEl] = React.useState(null);

	const handleDropDownClick = (event) => {
		setDropDownEl(event.currentTarget);
	};

	const handleDropDownClose = () => {
		setDropDownEl(null);
	};

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
									{!me && (
										<Box px={2}>
											<SC.StyledLink id="nav-bar-plans" to="/plans/" activeClassName="active">
												{t.plans}
											</SC.StyledLink>
										</Box>
									)}
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
							{me && (
								<Row>
									<Grid item>
										<RouterLink id="mobile-nav-bar-close-menu" to="/">
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
											menuItems={userLoggedInMenuItems}
											text="ישראל ישראלי"
										/>
									</Grid>
								</Row>
							)}
							{!me && (
								<Row gutter={0.75}>
									<Grid item>
										<Link id="registered-nav-bar-starred" to="/" withIcon={true}>
											<SC.StyledStarIcon>
												<StarIcon/>
											</SC.StyledStarIcon>
											<ListItemText primary={t.myPlans}/>
										</Link>
									</Grid>
									<Grid item>
										<Button id="sing-in" text={t.signin} fontWeight="400" simple onClick={()=>{}}/>
									</Grid>
									<Grid item>
										<Button id="sing-up" text={t.signup} small altColor onClick={()=>{}}/>
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

DesktopNavBar.propTypes = {
	me: PropTypes.bool,
};


export default DesktopNavBar;
