import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';
import Links from '../../../../components/Links';

export const LinksPanel = ({ links }) => {
    const theme = useTheme();
    const { t } = useTranslation();

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
                        {t.planLinks}
                    </Typography>
                </SC.PlanSummaryTitleWrapper>
                <SC.EntryContent>
                    <Links columns={2} links={links} />
                </SC.EntryContent>
            </TabBox>
        </TabPanel>
    );
};

LinksPanel.propTypes = {
    links: PropTypes.array,
};

export default LinksPanel;
