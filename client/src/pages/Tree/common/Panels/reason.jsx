import React from 'react';
import { TreeSelectors } from 'redux/selectors';
import { TabPanel, TabBox, Typography } from 'shared';
import { useTheme } from '@material-ui/styles';
import * as SC from './style';
import { Divider } from '@material-ui/core';

const TreeReasonPanel = () => {
	const theme = useTheme();
	const { treeData: { reason_short = 'לא צוין', reason_detailed, gush, helka, regional_office , person_request_name} } = TreeSelectors();

	return (
		<TabPanel>
			<TabBox>
				<SC.TreeSummaryTitleWrapper>
					<Typography variant="planDetailTitle" mobileVariant="planDetailTitle"
						component="h2" color={theme.palette.black}	>
						{`סיבה: ${reason_short || ''}`}
					</Typography>
				<Typography variant="paragraphText" mobileVariant="paragraphText"
					component="span" color={theme.palette.black}>
					{reason_detailed || 'לא צוין פירוט הסיבה'}
				</Typography>
				</SC.TreeSummaryTitleWrapper>
				<Divider />
				<SC.GushHelkaWrapper>
					<SC.GushWrapper>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.gray['main']}>
							{`גוש: `}
						</Typography>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.black}>
							{gush ||  'לא צוין'}
						</Typography>
					</SC.GushWrapper>
					<SC.HelkaWrapper>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.gray['main']}>
							{`חלקה: `}
						</Typography>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.black}>
							{helka||  'לא צוין'}
						</Typography>
					</SC.HelkaWrapper>
				</SC.GushHelkaWrapper>
				<SC.StatusAndTypeWrapper>
					<SC.StatusWrapper>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.gray['main']}>
							{`מבקש.ת: `}
						</Typography>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.black}>
							{person_request_name ||  'לא צוין'}
						</Typography>
					</SC.StatusWrapper>
					<SC.TypeWrapper>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.gray['main']}>
							{`פקיד יערות: `}
						</Typography>
						<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.black}>
							{regional_office||  'לא צוין'}
						</Typography>
					</SC.TypeWrapper>
				</SC.StatusAndTypeWrapper>
			</TabBox>
		</TabPanel>
	)
}

export default TreeReasonPanel;