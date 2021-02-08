import React from "react";
import PropTypes from "prop-types";
import { TabPanel, TabBox, Typography } from "shared";
import { useTheme } from "@material-ui/styles";
import UnsafeRender from "components/UnsafeRender";
import * as SC from "./style";
import t from "locale/he_IL";

export const DescriptionPanel = ({ mainDetailsFromMavat }) => {
    const theme = useTheme();
    if (!mainDetailsFromMavat) return null;

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
                        {t.planDescription}
                    </Typography>
                </SC.PlanSummaryTitleWrapper>
                <SC.EntryContent>
                    <UnsafeRender html={mainDetailsFromMavat} />
                </SC.EntryContent>
            </TabBox>
        </TabPanel>
    );
};

DescriptionPanel.propTypes = {
    mainDetailsFromMavat: PropTypes.string,
};

export default DescriptionPanel;
