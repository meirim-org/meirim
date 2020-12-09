import React from 'react';
import { useParams } from 'react-router-dom';
import { withGetScreen } from 'react-getscreen';
import PlanDesktop from './desktop';
import PlanMobile from './mobile';
import { useDataHandler } from './hooks';

const Plan = ({ isMobile }) => {
    const [tabValue, setValue] = React.useState(0);
    const handleTabChange = (_, newValue) => setValue(newValue);
    const { id: planId } = useParams();
    const { planData, dataArea, textArea } = useDataHandler(planId);

    if (!isMobile) return <PlanDesktop tabValue={tabValue} handleTabChange={handleTabChange}
                                       planData={planData} dataArea={dataArea} textArea={textArea}/>;
    else return <PlanMobile/>;
};

export default withGetScreen(Plan);