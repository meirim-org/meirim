import { StepperProgress } from 'components/StepperProgress';
import React from 'react';
import { TabPanel, TabBox, Typography } from 'shared';
import { useTheme } from '@material-ui/styles';

export const StatusPanel = () => {
    const theme = useTheme();

    return (
        <div>
            <TabPanel>
                <TabBox>
                    <Typography
                        variant="planDetailTitle"
                        mobileVariant="planDetailTitle"
                        component="h2"
                        color={theme.palette.black}
                    >
                        {'תהליך התכנון'}
                    </Typography>
                    <div>לחצו על השלבים כדי לצפות בהסבר</div>
                    <StepperProgress />
                </TabBox>
            </TabPanel>
        </div>
    );
};
