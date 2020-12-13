import React from 'react';
import PropTypes from 'prop-types';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { useTheme } from '@material-ui/styles';
import { Button, Tabs, Tab, Badge } from '@material-ui/core';
import { Typography } from 'shared';
import t from 'locale/he_IL';
import { a11yProps } from '../a11y'; 
import * as SC from '../style';

const Header = ({ countyName, name, tabValue, handleTabChange, comments }) => {
	const theme = useTheme();
	
	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<SC.SubTitleWrapper>
					<Typography variant="planDetailTitle" mobileVariant="smallTitle" component="span" color={theme.palette.primary.main}>
						{countyName}
					</Typography>
				</SC.SubTitleWrapper>
				<SC.TitleWrapper>
					<Typography variant="planTitle" mobileVariant="paragraphText" component="h1" color={theme.palette.black}>
						{name}
					</Typography>
				</SC.TitleWrapper>
				<SC.AppBar position="static">
					<Tabs value={tabValue} onChange={handleTabChange} aria-label="טאבים של התוכנית">
						<Tab label={t.summary} {...a11yProps(0)} />
						<Tab label={<Badge badgeContent={comments}> {t.opinion} </Badge>} {...a11yProps(1)} />
						<Tab label={t.planningInformation} {...a11yProps(2)} />
					</Tabs>
				</SC.AppBar>
			</SC.TitlesAndTabs>
			<SC.Buttons>
				<Button variant="contained" color="primary" startIcon={<ShareIcon />}>
					<Typography variant="chipsAndIconButtons" mobileVariant="chipsAndIconButtons" component="span" color={theme.palette.gray['800']}>
						{t.sharing}
					</Typography>
				</Button>
				<Button variant="contained" color="primary" startIcon={<StarBorderIcon />}>
					<Typography variant="chipsAndIconButtons" mobileVariant="chipsAndIconButtons" component="span" color={theme.palette.gray['800']}>
						{t.saving}
					</Typography>
				</Button>
				<Button
					variant="contained"
					color="primary"
					startIcon={<ChatBubbleOutlineIcon />}
				>
					<Typography variant="chipsAndIconButtons" mobileVariant="chipsAndIconButtons" component="span" color={theme.palette.gray['800']}>
						{t.addAnOpinion}
					</Typography>
				</Button>
			</SC.Buttons>
		</SC.Header>
	);
};



Header.propTypes = {
	name: PropTypes.string,
	countyName: PropTypes.string.isRequired,
	tabValue: PropTypes.number.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	comments: PropTypes.string.isRequired,
};

export default Header;