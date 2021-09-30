import React from 'react';
import { TabPanel, TabBox, Typography, Button } from 'shared';
import * as SC from './style';
import { treeAppealGuideUrl } from '../../constants';
import t from 'locale/he_IL';
import { colors } from 'style';

const TreeAppealPanel = () => {

	return (
		<TabPanel>
			<TabBox>
				<SC.TreeSummaryTitleWrapper>
					<Typography variant="planDetailTitle" mobileVariant="planDetailTitle"
						component="h2" color={colors.black}	>
						{t.treeAppealTitle}
					</Typography>
				</SC.TreeSummaryTitleWrapper>
				<Typography variant="paragraphText" mobileVariant="paragraphText"
					component="span" color={colors.black}>
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