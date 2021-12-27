import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { Button, TabBox, TabPanel, Typography } from 'shared';
import { treeAppealGuideUrl } from '../../constants';
import * as SC from './style';

const TreeAppealPanel = () => {
	const { t } = useTranslation(); 
	const theme = useTheme();

	return (
		<TabPanel>
			<TabBox>
				<SC.TreeSummaryTitleWrapper>
					<Typography variant="planDetailTitle" mobileVariant="planDetailTitle"
						component="h2" color={theme.palette.black}	>
						{t.treeAppealTitle}
					</Typography>
				</SC.TreeSummaryTitleWrapper>
				<Typography variant="paragraphText" mobileVariant="paragraphText"
					component="span" color={theme.palette.black}>
					{t.treeAppealExplained}
				</Typography>
				<SC.ButtonWrapper>
					<Button id="tree-appeal-button" text={t.treeAppealButton}
					 small='small' target="_blank" rel="noopener noreferrer" href={treeAppealGuideUrl} />
				</SC.ButtonWrapper>
			</TabBox>
		</TabPanel>
	)
}

export default TreeAppealPanel;