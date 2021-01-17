import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import t from 'locale/he_IL';
import { useTheme } from '@material-ui/styles';
import { Chip, Grid } from '@material-ui/core';
import * as SC from './style';
import { TreeSelectors } from 'redux/selectors';
import { timeToObjectionText } from '../../utils';
import TreeCuttingIcon from 'assets/svg/treeCuttingIcon';


const TreeList = ({ trees_per_permit }) => {

	if (!trees_per_permit) return null;
	if (Object.keys(trees_per_permit).length === 1) {
		return (
			<SC.TreeTermsWrapper>
				<SC.TreeTermWrapper>
					<Chip label={Object.keys(trees_per_permit)[0]} />
				</SC.TreeTermWrapper>
			</SC.TreeTermsWrapper>
		)
	}
	const treesWithNumbers = [];
	for (let [key, value] of Object.entries(trees_per_permit)) {
		treesWithNumbers.push({ name: key, number: value });
	}

	return (
		<SC.TreeTermsWrapper>
			{
				treesWithNumbers.map((tree, index) => {
					return (
						<SC.TreeTermWrapper key={index}>
							<Chip label={`${tree.name} (${tree.number})`} />
						</SC.TreeTermWrapper>
					)
				})
			}
		</SC.TreeTermsWrapper>
	);
}

const TreeDetailsPanel = () => {
	const theme = useTheme();
	const { treeData: { action, start_date, permit_number, total_trees, trees_per_permit } } = TreeSelectors();

	const treeText = (total_trees === 1) ? 'עץ אחד' : `${total_trees} עצים`;
	return (
		<TabPanel>
			<TabBox>
				<Grid container direction="row-reverse" justify="space-between">
					<Grid item>
						<TreeCuttingIcon />
					</Grid>
					<Grid item>
						<SC.TreeSummaryTitleWrapper>
							<Typography variant="planDetailTitle" mobileVariant="planDetailTitle"
								component="h2" color={theme.palette.black}	>
								{`עצים ל${action}`}
							</Typography>
						</SC.TreeSummaryTitleWrapper>
						<SC.StatusAndTypeWrapper>
							<SC.TotalTreeWrapper>
								<Chip label={treeText} />
								<Typography variant="paragraphText" mobileVariant="paragraphText"
									component="span" color={theme.palette.black}>
									{' מסוג '}
								</Typography>
							</SC.TotalTreeWrapper>
							<TreeList trees_per_permit={trees_per_permit} />
						</SC.StatusAndTypeWrapper>
						<SC.StatusAndTypeWrapper>
							<SC.StatusWrapper>
								<Typography variant="paragraphText" mobileVariant="paragraphText"
									component="span" color={theme.palette.gray['main']}>
									{`${t.lastDateToObjectTrees}: `}
								</Typography>
								<Typography variant="paragraphText" mobileVariant="paragraphText"
									component="span" color={theme.palette.black}>
									{start_date && new Intl.DateTimeFormat('he-IL').format(new Date(start_date))}
									{start_date && ` (${timeToObjectionText(start_date)})`}
								</Typography>
							</SC.StatusWrapper>
						</SC.StatusAndTypeWrapper>

						<SC.StatusAndTypeWrapper>
							<SC.StatusWrapper>
								<Typography variant="paragraphText" mobileVariant="paragraphText"
									component="span" color={theme.palette.gray['main']}>
									{`${t.permitNumber} `}
								</Typography>
								<Typography variant="paragraphText" mobileVariant="paragraphText"
									component="span" color={theme.palette.black}>
									{permit_number}

								</Typography>
							</SC.StatusWrapper>
						</SC.StatusAndTypeWrapper>

						<SC.UrlWrapper>
							<a target="_blank" rel="noopener noreferrer" href={'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Pages/default.aspx'}>{t.treePermitOnGovSite}</a>
							<SC.CustomLinkIcon></SC.CustomLinkIcon>
						</SC.UrlWrapper>
					</Grid>
				</Grid>
			</TabBox>
		</TabPanel>
	);
};


TreeDetailsPanel.propTypes = {
	type: PropTypes.string,
	status: PropTypes.string,
	url: PropTypes.string,
};

export default TreeDetailsPanel;