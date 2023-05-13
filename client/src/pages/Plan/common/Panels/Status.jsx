import { StepperProgress } from 'components/StepperProgress';
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash';
import { TabPanel, TabBox, Typography } from 'shared';
import { useTheme } from '@material-ui/styles';
import { getStatus } from 'pages/Plan/controller';

export const StatusPanel = ({ planId }) => {
    const theme = useTheme();

    const [steps, setSteps] = useState([]);
    const [isFinishedLoading, setIsFinishedLoading] = useState(false);

    useEffect(() => {
        getStatus(planId)
            .then((res) => {
                if (res && res.data && isArray(res.data?.steps)) {
                    setSteps(res.data?.steps);
                }
            })
            .catch((e) => {})
            .finally(() => {
                setIsFinishedLoading(true);
            });
    }, [planId]);

    const shouldDisplayPanel = useMemo(() => {
        return isFinishedLoading && steps.length > 0;
    }, [isFinishedLoading, steps]);

    if (!shouldDisplayPanel) return <></>;

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
                    <StepperProgress planId={planId} steps={steps} />
                </TabBox>
            </TabPanel>
        </div>
    );
};

StatusPanel.propTypes = {
    planId: PropTypes.string.isRequired,
};
