import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, TabBox, Typography } from 'shared';
import { useTheme } from '@material-ui/styles';
import UnsafeRender from 'components/UnsafeRender';
import * as SC from './style';

export const TextPanel = ({ title, content }) => {
	const theme = useTheme();
	if (!title || !content) return null;
	
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
						{title}
					</Typography>
				</SC.PlanSummaryTitleWrapper>
				<SC.EntryContent>
					<UnsafeRender
						html={content}
					/>
				</SC.EntryContent>
			</TabBox>
		</TabPanel>
	);
};

TextPanel.propTypes = {
	title: PropTypes.string,
	content: PropTypes.string,
};

export default TextPanel;