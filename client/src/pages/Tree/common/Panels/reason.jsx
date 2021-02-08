import React from "react";
import { TreeSelectors } from "redux/selectors";
import { TabPanel, TabBox, Typography } from "shared";
import { useTheme } from "@material-ui/styles";
import * as SC from "./style";

const TreeReasonPanel = () => {
    const theme = useTheme();
    const {
        treeData: { reason_short = "לא צוין", reason_detailed },
    } = TreeSelectors();

    return (
        <TabPanel>
            <TabBox>
                <SC.TreeSummaryTitleWrapper>
                    <Typography
                        variant="planDetailTitle"
                        mobileVariant="planDetailTitle"
                        component="h2"
                        color={theme.palette.black}
                    >
                        {`סיבה: ${reason_short}`}
                    </Typography>
                </SC.TreeSummaryTitleWrapper>
                <Typography
                    variant="paragraphText"
                    mobileVariant="paragraphText"
                    component="span"
                    color={theme.palette.black}
                >
                    {reason_detailed || "לא צוין פירוט הסיבה"}
                </Typography>
            </TabBox>
        </TabPanel>
    );
};

export default TreeReasonPanel;
