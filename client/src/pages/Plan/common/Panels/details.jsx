import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'react-moment';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';

const DetailsPanel = ({ status, type, lastUpdate, url }) => {
	const { t } = useTranslation();
	const theme = useTheme();
	
	return (
		<TabPanel>
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
				<SC.LastUpdateDateWrapper>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="span"
						color={theme.palette.gray['main']}>
						{`${t.lastUpdateDate}: `}
					</Typography>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="span"
						color={theme.palette.black}>
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