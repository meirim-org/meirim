import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography, Link } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import {  Chip } from '@material-ui/core';
import * as SC from './style';

/*mynameisuh*/
const PlanDetailsPanel = ({ status, terms, tabValue, type, url }) => {
	const theme = useTheme();
	
	return (
		<TabPanel value={tabValue} index={0}>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={theme.palette.black}
					>
						{t.planDetails}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				
				{terms.length > 0 &&
					<SC.PlanTermsWrapper>
						{terms.map((term, index) => (
							<SC.PlanTermWrapper key={index}>
								<Chip label={term} />
							</SC.PlanTermWrapper>
						))}
					</SC.PlanTermsWrapper>
				}

				<SC.StatusAndTypeWrapper>
					<SC.StatusWrapper>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.gray['main']}>
							{`${t.status}: `}
						</Typography>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.black}>
							{status}
						</Typography>
					</SC.StatusWrapper>
					<SC.TypeWrapper>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.gray['main']}>
							{`${t.planType}: `}
						</Typography>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={theme.palette.black}>
							{type}
						</Typography>
					</SC.TypeWrapper>
				
				</SC.StatusAndTypeWrapper>

				<SC.UrlWrapper>
					<Link textDecoration="none" url={url} text={t.planDeatailOnGovSite}/>
					<SC.CustomLinkIcon></SC.CustomLinkIcon>
				</SC.UrlWrapper>
			</TabBox>
		</TabPanel>
	);
};


PlanDetailsPanel.propTypes = {
	type: PropTypes.string,
	status: PropTypes.string,
	terms: PropTypes.array,
	url: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
};

export default PlanDetailsPanel;