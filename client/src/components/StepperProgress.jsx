import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { size, findIndex } from 'lodash';
import moment from 'moment';
import StepLabel from '@material-ui/core/StepLabel';
import styled from 'styled-components';
import { Button } from 'shared';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        cursor: 'pointer',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },

    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    backgroundColor: {
        backgroundColor: 'red',
    },
}));
const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        alignItems: 'center',
    },

    circle: {
        width: 13,
        height: 13,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        width: 13,
        height: 13,
        boxShadow: 'none',
        borderRadius: '50%',
        backgroundColor: '#8bdbbf',
    },
    active: {
        color: '#ae7ff0',
        borderRadius: '50%',
        width: 13,
        height: 13,
        boxShadow: '0px 0px 0px 15px #f0e3fd',
        backgroundColor: '#ae7ff0',
    },
    approval: {
        width: 13,
        height: 13,
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0px 0px 0px 15px #1876d2',
    },
});

const StepButtonStyle = styled(StepButton)`
    background: 
    
    ${(props) =>
        props.stepcomplited
            ? '#e6f8f3 !important'
            : (props.isActiveStep
            ? 'linear-gradient(270deg,rgba(230, 248, 243, 1) 50%,rgba(251, 251, 251, 1) 50% ) !important'
            : ' #fbfbfb !important')};

    ${(props)=> props.isActiveStep &&'background: linear-gradient(90deg, rgba(251, 251, 251, 1), 50%, rgba(230, 248, 243, 1) 50%) !important;'}

    padding: 10px 16px !important;
    border-radius: ${(props) =>
        props.index === 3
            ? '50px  0  0 50px'
            : props.index === 0
            ? '0px  50px  50px 0'
            : '0'} !important;
    :focus {
        outline: none;
    }
`;

const StepperStyle = styled(Stepper)`
    padding: 24px 0px !important;
`;

const LabelStep = styled.div`
    margin-top: 2rem;
    text-align: center;
    color: ${(props) =>
        props.approved ? '#1876d2' : props.active ? '#AE7FF0' : '#918899'};
    font-weight: ${(props) => (props.active ? 'bold' : '')};
`;

export const StepperProgress = ({ steps, cancellationDate }) => {
    const classes = useStyles();

    const [clickedStep, setClickedSteps] = useState(null);

    const allStepsCompleted = useMemo(() => {
        if (!steps || steps.length === 0) return false;
        return steps[steps.length - 1].completed;
    }, [steps]);


    const activeStep = useMemo(()=> {
        return findIndex(steps, (step)=> step.current);
    }, [steps]);

    const displayDate = (dateString) => {
        const string = moment(dateString).format('DD/MM/YYYY');
        if(string && string !== 'Invalid date') return string
        return '';
    };

    const onButtonClick = () => {
        // Opening a poptin based on the selected step
        const poptinIdsForSteps = ['d31f5c4276200', '7c7e66500c4ac', '0c47c056d9c62', '672c4710c1670', ''];
        const poptinId = poptinIdsForSteps[activeStep];
        if(window.poptin_display && poptinId) {
			window.poptin_display(poptinId);
		}
    };

    const planApprovalDate = useMemo(() => {
        if (!steps || size(steps) === 0 || !allStepsCompleted) return '';
        return displayDate(steps[steps.length - 1].date);
    }, [steps, allStepsCompleted]);

    const isPlanCancalled = useMemo(() => {
        return !!cancellationDate;
    }, [cancellationDate]);

    function QontoStepIcon(props) {
        const classes = useQontoStepIconStyles();
        const { active, completed, approval } = props;

        if (approval) {
            return (
                <div
                    className={clsx(classes.root, {
                        [classes.active]: active,
                    })}
                >
                    <div className={classes.approval} />
                </div>
            );
        }

        return (
            <div
                className={clsx(classes.root, {
                    [classes.active]: active,
                })}
            >
                {completed && !active ? (
                    <div className={classes.completed} />
                ) : (
                    <div className={classes.circle} />
                )}
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <StepperStyle
                connector={''}
                alternativeLabel
                activeStep={activeStep}
            >
                {steps.map((step, index) => {
                    const stepProps = {};
                    const buttonProps = {};

                    const iconLabelProps = {
                        completed: step.completed,
                        active: index === activeStep,
                        approval: index === steps.length - 1 && step.completed,
                    };

                    return (
                        <Step
                            key={index}
                            {...stepProps}
                            onClick={() => {setClickedSteps(steps[index]) }
                            }
                        >
                            <StepButtonStyle
                                index={index}
                                disabled
                                completed={steps[index].completed}
                                approval={true}
                                activestep={activeStep}
                                isActiveStep={index === activeStep}
                                stepcomplited={steps[index].completed}
                                {...buttonProps}
                            >
                                <StepLabel
                                    StepIconComponent={() =>
                                        QontoStepIcon(iconLabelProps)
                                    }
                                ></StepLabel>
                            </StepButtonStyle>
                            <LabelStep approved={iconLabelProps.approval}>
                                {step.name}
                            </LabelStep>
                        </Step>
                    );
                })}
            </StepperStyle>
            <div>
                {allStepsCompleted ? (
                    <div>
                        <>
                            {!isPlanCancalled && (
                                <Typography className={classes.instructions}>
                                    התוכנית אושרה בתאריך: {planApprovalDate}
                                </Typography>
                            )}
                        </>
                        <>
                            {isPlanCancalled && (
                                <Typography className={classes.instructions}>
                                    התוכנית בוטלה בתאריך:{' '}
                                    {displayDate(cancellationDate)}
                                </Typography>
                            )}
                        </>
                    </div>
                ) : (
                    <div> { !!clickedStep &&
                        <Typography className={classes.instructions}>
                            <div
                                style={{
                                    width: '100%',
                                    justifyContent: 'space-between',

                                    boxShadow:
                                        ' 0px -2px 20px rgba(0, 0, 0, 0.08)',
                                    borderRadius: '12px 12px 0 0',
                                    padding: '12px 24px',
                                }}
                            >
                                <div>{clickedStep?.description}</div>
                                <div>{displayDate(clickedStep?.date)}</div>
                            </div>
                        </Typography>
}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>איך אפשר להשפיע על התהליך?</div>
                            <Button text="מידע נוסף" altColor onClick={onButtonClick} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
