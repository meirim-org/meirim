import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import Moment from 'react-moment';
//import {  Chip } from '@material-ui/core';
//import { planTerms } from 'pages/Plan/utils';
import * as SC from './style';
import { colors } from 'style';

const DetailsPanel = ({ status, type, lastUpdate, url }) => {
	return (
		<TabPanel>
			<TabBox>
				<SC.PlanSummaryTitleWrapper>
					<Typography
						variant="planDetailTitle"
						mobileVariant="planDetailTitle"
						component="h2"
						color={colors.black}
					>
						{t.planDetails}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				
				{/*{planTerms.length > 0 &&
					<SC.PlanTermsWrapper>
						{planTerms.map((term, index) => (
							<SC.PlanTermWrapper key={index}>
								<Chip label={term} />
							</SC.PlanTermWrapper>
						))}
					</SC.PlanTermsWrapper>
				}*/}

				<SC.StatusAndTypeWrapper>
					<SC.StatusWrapper>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={colors.grey[500]}>
							{`${t.status}: `}
						</Typography>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={colors.black}>
							{status}
						</Typography>
					</SC.StatusWrapper>
					<SC.TypeWrapper>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={colors.grey[500]}>
							{`${t.planType}: `}
						</Typography>
						<Typography
							variant="paragraphText"
							mobileVariant="paragraphText"
							component="span"
							color={colors.black}>
							{type}
						</Typography>
					</SC.TypeWrapper>
				</SC.StatusAndTypeWrapper>
				<SC.LastUpdateDateWrapper>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="span"
						color={colors.grey[500]}>
						{`${t.lastUpdateDate}: `}
					</Typography>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="span"
						color={colors.black}>
						<Moment
							parse="YYYYMMDDHHmm"
							format="DD/MM/YYYY"
						>
							{lastUpdate}
						</Moment>
					</Typography>
				</SC.LastUpdateDateWrapper>
				<SC.UrlWrapper>
					<a target="_blank" rel="noopener noreferrer" href={url}>{t.planDeatailOnGovSite}</a>
					<SC.CustomLinkIcon></SC.CustomLinkIcon>
				</SC.UrlWrapper>
			</TabBox>
		</TabPanel>
	);
};


DetailsPanel.propTypes = {
	type: PropTypes.string,
	status: PropTypes.string,
	url: PropTypes.string,
};

export default DetailsPanel;