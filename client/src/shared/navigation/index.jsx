import React, { useState } from 'react';
import api from '../../services/api';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import t from '../../locale/he_IL';
import logo from '../../assets/logo.png';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Row, IconButton, Menu, Link } from '../../shared';
import {
	Grid,
	Container,
	Box,
	Hidden,
	Drawer,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Divider
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import { colors } from '../../style/index'

const Logo = styled.img`
    max-width: 53px;
    height: auto;
`;

const StyledList = styled(List)`
    padding: 0 !important;
`

const StyledListItem = styled(ListItem)`
    padding: 1.2rem 3.5rem !important;
    color: ${props => props.color}!important;
    .MuiListItemText-root {
      flex: none;
    }
    .MuiListItemIcon-root {
      margin: 0 .75rem;
      min-width: auto;
    }
    span {
        font-family: Assistant !important;
        font-size: 18px;      
    }
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


const MobileNavWrapper = styled.div`
    width: 250px;
`;

const LogOutIcon = styled(ListItemIcon)`
  path {
    color: #d1ccd5;
  }
`
const StyledStarIcon = styled(ListItemIcon)`
  path {
    color: #652dd0;
  }
`

const Navigation = ({ me }) => {
	const [signOutSuccess, setSignOutSuccess] = useState(false);
	const [mobileNavIsOpened, setMobileNavIsOpened] = useState(false);
	const [dropDownEl, setDropDownEl] = React.useState(null);

	const userLoggedInMenuItems = [
		{
			'text': 'item 1',
			'to': '/'
		},
		{
			'text': 'item 2',
			'to': '/'
		},
		{
			'text': 'item 3',
			'to': '/'
		}
	]
	const handleDropDownClick = (event) => {
		setDropDownEl(event.currentTarget);
	};

	const handleDropDownClose = () => {
		setDropDownEl(null);
	};
	// me = {};
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
									{!me && (
										<Box px={2}>
											<StyledLink to="/plans/" activeClassName="active">
												{t.plans}
											</StyledLink>
										</Box>
									)}
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
											<Button id="support-us" text={t.supportUs} type={'primary'} onClick={''}
												small/>
										</Box>
									</Hidden>
								</Box>
							</Box>
						</Row>
					</Box>
					<Box>
						<Hidden mdUp>
							<Row gutter={0.15}>
								{me && (
									<>
										<Box display="flex">
											<RouterLink to="/">
												<IconButton
													color={colors.purple}
													ariaLabel={'Favorites'}
													fontSize={24}
													paddingg={0}
												>
													<BookmarkBorderIcon/>
												</IconButton>
											</RouterLink>
										</Box>
										<Box display="flex">
											<RouterLink to="/">
												<IconButton
													color={colors.purple}
													ariaLabel={'Notifications'}
													fontSize={24}
													paddingg={0}
												>
													<NotificationsNoneIcon/>
												</IconButton>
											</RouterLink>
										</Box>

										<Box>
											<Menu
												ariaControls="user-menu"
												openHandler={handleDropDownClick}
												closeHandler={handleDropDownClose}
												textColor="#1a2d66"
												iconBefore={<AccountCircleIcon color="primary"/>}
												dropDownEl={dropDownEl}
												menuItems={userLoggedInMenuItems}
											/>
										</Box>
									</>
								)}

								<Box>
									<IconButton color={colors.purple} ariaLabel={'open mobile menu'}>
										<MenuIcon onClick={() => setMobileNavIsOpened(true)}/>
									</IconButton>

									<Drawer open={mobileNavIsOpened}>
										<MobileNavWrapper
											role="presentation"
										>
											<Box display="flex" justifyContent="flex-end" m={1.5}>
												<IconButton
													color={colors.black}
													ariaLabel={'close mobile menu'}
													fontSize={20.5}
												>
													<CloseIcon onClick={() => setMobileNavIsOpened(false)}/>
												</IconButton>
											</Box>

											<StyledList>
												{me && (
													<StyledListItem component={RouterLink} to="/" button key={t.myPlans}
														color="#652dd0">
														<ListItemText primary={t.myPlans}/>
														<StyledStarIcon>
															<StarIcon/>
														</StyledStarIcon>
													</StyledListItem>
												)}
												<StyledListItem component={RouterLink} to="/" button key={t.plans}>
													<ListItemText primary={t.plans}/>
												</StyledListItem>
											</StyledList>
											<Divider/>
											<StyledList>
												<StyledListItem component={RouterLink} to="/" button key={t.supportUs}>
													<ListItemText primary={t.supportUs}/>
												</StyledListItem>
											</StyledList>
											<Divider/>
											<StyledList>
												{!me && (
													<>
														<StyledListItem component={RouterLink} to="/" button
															key={t.signin}>
															<ListItemText primary={t.signin}/>
														</StyledListItem>
														<StyledListItem component={RouterLink} to="/" button
															key={t.signup}
															color="#652dd0">
															<ListItemText primary={t.signup}/>
														</StyledListItem>
													</>
												)}
												{me && (
													<>
														<StyledListItem component={RouterLink} to="/" button
															key={t.alerts}>
															<ListItemText primary={t.alerts}/>
														</StyledListItem>
														<StyledListItem component={RouterLink} to="/" button
															key={t.signout}
															color="#b71f29">
															<ListItemText primary={t.signout}/>
															<LogOutIcon>
																<InboxIcon/>
															</LogOutIcon>
														</StyledListItem>
													</>
												)}
											</StyledList>
										</MobileNavWrapper>
									</Drawer>
								</Box>

							</Row>

						</Hidden>

						<Hidden smDown>
							{me && (
								<Row>
									<Grid item>
										<RouterLink to="/">
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
										<Link to="/" withIcon={true}>
											<StyledStarIcon>
												<StarIcon/>
											</StyledStarIcon>
											<ListItemText primary={t.myPlans}/>
										</Link>
									</Grid>
									<Grid item>
										<Button id="sing-in" text={t.signin} fontWeight="400" simple onClick={''}/>
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
