import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { size } from 'lodash';
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
        marginBottom: theme.spacing(1),
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
    active: {
        color: '#ae7ff0',
        borderRadius: '50%',
        width: 13,
        height: 13,
        boxShadow: '0px 0px 0px 15px #f0e3fd',
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
    approval: {
        width: 13,
        height: 13,
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0px 0px 0px 15px #1876d2',
    },
});

const StepButtonStyle = styled(StepButton)`
    background: ${(props) =>
        props.stepcomplited
            ? '#e6f8f3 !important'
            : props.index === props.activestep
            ? 'linear-gradient(270deg,rgba(230, 248, 243, 1) 50%,rgba(251, 251, 251, 1) 50% ) !important'
            : ' #fbfbfb !important'};

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
    // const theme = useTheme();

    const [activeStep, setActiveStep] = useState(null);
    const [clickedStep, setClickedSteps] = useState(null);

    const allStepsCompleted = useMemo(() => {
        if (!steps || steps.length === 0) return false;
        return steps[steps.length - 1].completed;
    }, [steps]);

    useEffect(() => {
        steps.map((step, i) => {
            if (step.current) {
                setActiveStep(i);
                setClickedSteps({ ...steps[i] });
            }
        });
    }, [steps]);

    const handleStep = (step) => () => {
        setClickedSteps(step);
    };

    const displayDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
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
                {completed ? (
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
                            onClick={() =>
                                steps[index].completed &&
                                setClickedSteps(steps[index])
                            }
                        >
                            <StepButtonStyle
                                index={index}
                                disabled
                                onClick={handleStep(index)}
                                completed={steps[index].completed}
                                approval={true}
                                activestep={activeStep}
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
                    <div>
                        <Typography className={classes.instructions}>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'space-between',

                                    boxShadow:
                                        ' 0px -2px 20px rgba(0, 0, 0, 0.08)',
                                    borderRadius: '12px 12px 0 0',
                                    padding: '12px 24px',
                                }}
                            >
                                <div>{clickedStep?.description}</div>
                                <div>{clickedStep?.date}</div>
                            </div>
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>איך אפשר להשפיע על התהליך?</div>
                            <Button text="מידע נוסף" altColor />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
