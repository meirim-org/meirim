import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';
import LinkItem from '../../../../components/LinkItem';
import { LinksWrapper } from './style';

export const LinksPanel = () => {
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
                    <LinksWrapper>
                        <LinkItem />
                        <LinkItem />
                        <LinkItem />
                    </LinksWrapper>
                </SC.EntryContent>
            </TabBox>
        </TabPanel>
    );
};

LinksPanel.propTypes = {
    mainDetailsFromMavat: PropTypes.string,
};

export default LinksPanel;
