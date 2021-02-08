import React from "react";
import PropTypes from "prop-types";
import { TabPanel, TabBox, Typography } from "shared";
import { useTheme } from "@material-ui/styles";
import UnsafeRender from "components/UnsafeRender";
import * as SC from "./style";
import t from "locale/he_IL";

export const GoalsPanel = ({ goalsFromMavat }) => {
    const theme = useTheme();
    if (!goalsFromMavat) return null;

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
                        {t.planGoals}
                    </Typography>
                </SC.PlanSummaryTitleWrapper>
                <SC.EntryContent>
                    <UnsafeRender html={goalsFromMavat} />
                </SC.EntryContent>
            </TabBox>
        </TabPanel>
    );
};

GoalsPanel.propTypes = {
    goalsFromMavat: PropTypes.string,
};

export default GoalsPanel;
