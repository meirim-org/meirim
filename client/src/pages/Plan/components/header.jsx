import React from 'react';
import PropTypes from 'prop-types';
import ShareIcon from '@material-ui/icons/Share';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { useTheme } from '@material-ui/styles';
import { Button, Tabs, Tab, Badge } from '@material-ui/core';
import { Text } from 'shared';
import t from 'locale/he_IL';
import { a11yProps } from '../a11y'; 
import * as SC from '../style';

const Header = ({ countyName, name, tabValue, handleTabChange, comments }) => {
	const theme = useTheme();
	
	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<SC.SubTitleWrapper>
					<Text size="18px" weight="600" text={countyName} component="span" color={theme.palette.primary.main}/>
				</SC.SubTitleWrapper>
				<SC.TitleWrapper>
					<Text size="24px" lineHeight="1.17" weight="600" text={name} component="h1" color={theme.palette.black}/>
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
					<Text size="14px" text={t.sharing} component="span" color={theme.palette.gray['800']}/>
				</Button>
				<Button variant="contained" color="primary" startIcon={<StarBorderIcon />}>
					<Text size="14px" text={t.saving} component="span" color={theme.palette.gray['800']}/>
				</Button>
				<Button
					variant="contained"
					color="primary"
					startIcon={<ChatBubbleOutlineIcon />}
				>
					<Text size="14px" text={t.addAnOpinion} component="span" color={theme.palette.gray['800']}/>
				</Button>
			</SC.Buttons>
		</SC.Header>
	);
};



Header.propTypes = {
	name: PropTypes.string,
	countyName: PropTypes.string.isRequired,
	tabValue: PropTypes.any.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	comments: PropTypes.string.isRequired,
};

export default Header;