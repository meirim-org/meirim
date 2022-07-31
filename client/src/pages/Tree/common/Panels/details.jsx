import { Chip } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TreeSelectors } from 'redux/selectors';
import { TabBox, TabPanel, Typography } from 'shared';
import { timeToObjectionText } from '../../utils';
import * as SC from './style';

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
	const { t } = useTranslation();
	const theme = useTheme();
	const { treeData: { action, permit_number, total_trees, trees_per_permit, last_date_to_objection } } = TreeSelectors();

	let treeText = (total_trees === 1) ? 'עץ אחד' : `${total_trees} עצים`;
	if (total_trees === 0) { treeText = 'לא צוין מספר העצים'};
	return (
		<TabPanel>
			<TabBox>
			
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
							{last_date_to_objection && new Intl.DateTimeFormat('he-IL').format(new Date(last_date_to_objection))}
							{ ` (${timeToObjectionText(last_date_to_objection)})`}
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
					<a target="_blank" rel="noopener noreferrer" href={'https://www.gov.il/he/departments/guides/pro_felling_trees'}>{t.treePermitOnGovSite}</a>
					<SC.CustomLinkIcon></SC.CustomLinkIcon>
				</SC.UrlWrapper>

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