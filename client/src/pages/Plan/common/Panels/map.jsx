import React from "react";
import PropTypes from "prop-types";
import { TabPanel, TabBox, Typography } from "shared";
import t from "locale/he_IL";
import { useTheme } from "@material-ui/styles";
import * as SC from "./style";
import Mapa from "components/Mapa";

export const MapPanel = (props) => {
    const { geom } = props;
    const theme = useTheme();

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
                        {t.location}
                    </Typography>
                </SC.PlanSummaryTitleWrapper>
                <SC.MapWrapper>
                    {geom && (
                        <Mapa
                            geom={geom}
                            hideZoom={false}
                            disableInteractions={false}
                        />
                    )}
                </SC.MapWrapper>
            </TabBox>
        </TabPanel>
    );
};

MapPanel.propTypes = {
    goalsFromMavat: PropTypes.string,
    geom: PropTypes.object,
    countyName: PropTypes.string,
};

export default MapPanel;
