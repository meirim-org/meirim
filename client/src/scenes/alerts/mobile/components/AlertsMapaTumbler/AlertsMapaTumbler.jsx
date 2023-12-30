import React, { useState } from 'react';
import * as SC from './style';
import { Checkbox } from 'shared';
import LaunchIcon from '@material-ui/icons/Launch';
import CloseIcon from '@material-ui/icons/Close';

const AlertsMapaTumbler = ({ tumbler: { plans, trees }, tumblerHandler }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SC.Tumbler>
            {isOpen ? (
                <>
                    <SC.Label>
                        <Checkbox
                            text=""
                            onClick={tumblerHandler}
                            id="plans"
                            checked={plans}
                        />
                        <span className="circle circle_blue"></span>
                        <SC.InputName>תוכניות בנייה</SC.InputName>
                    </SC.Label>

                    <SC.Label>
                        <Checkbox
                            text=""
                            onClick={tumblerHandler}
                            id="trees"
                            checked={trees}
                        />
                        <span className="circle circle_green"></span>
                        <SC.InputName>רישיונות כריתה של עצים</SC.InputName>
                    </SC.Label>
                    <SC.CloseIconWrapper>
                        <CloseIcon fontSize='small' onClick={() => setIsOpen(false)} />
                    </SC.CloseIconWrapper>
                </>
            ) : (
                <LaunchIcon fontSize='small' onClick={() => setIsOpen(true)} />
            )}
        </SC.Tumbler>
    );
};

export default AlertsMapaTumbler;
