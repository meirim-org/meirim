import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import StepLabel from '@material-ui/core/StepLabel';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // padding: '20px 0px',
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
        // height: 22,
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
});

function getSteps() {
    return [
        'על שולחן הוועדה',
        'הסכמה עקרונית',
        'הערות הציבור',
        'תוכנית מאושרת',
    ];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'הוגש לועדה בתאריך:';
        case 1:
            return 'החלטה להפקדה בתאריך:';
        case 2:
            return 'התוכנית הופסקה בתאריך:';
        case 3:
            return 'התוכנית אושרה בתאריך:';
        default:
            return 'Unknown step';
    }
}
const StepButtonStyle = styled(StepButton)`
    background: ${(props) =>
        props.stepcomplited.has(props.index)
            ? '#e6f8f3 !important'
            : props.nextstep === props.index
            ? props.index === 0
                ? '#fbfbfb !important'
                : 'linear-gradient(270deg,rgba(230, 248, 243, 1) 50%,rgba(251, 251, 251, 1) 50% ) !important'
            : '#fbfbfb !important'};
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
    color: ${(props) => (props.active ? '#AE7FF0' : '#918899')};
    font-weight: ${(props) => (props.active ? 'bold' : '')};
`;

export const StepperProgress = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState(new Set());
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps();

    const totalSteps = () => {
        return getSteps().length;
    };

    const handleSkip = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const skippedSteps = () => {
        return skipped.size;
    };

    const completedSteps = () => {
        return completed.size;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps() - skippedSteps();
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed
                  // find the first step that has been completed
                  steps.findIndex((step, i) => !completed.has(i))
                : activeStep + 1;

        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };
    const handleComplete = () => {
        const newCompleted = new Set(completed);
        newCompleted.add(activeStep);
        setCompleted(newCompleted);

        /**
         * Sigh... it would be much nicer to replace the following if conditional with
         * `if (!this.allStepsComplete())` however state is not set when we do this,
         * thus we have to resort to not being very DRY.
         */
        if (completed.size !== totalSteps() - skippedSteps()) {
            handleNext();
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted(new Set());
        setSkipped(new Set());
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    function isStepComplete(step) {
        return completed.has(step);
    }

    function QontoStepIcon(props) {
        const classes = useQontoStepIconStyles();
        const { active, completed } = props;
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
                // nonLinear
                activeStep={activeStep}
            >
                {steps.map((label, index) => {
                    const stepProps = {};
                    const buttonProps = {};

                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step
                            key={label}
                            {...stepProps}
                            onClick={() => console.log(label)}
                        >
                            <StepButtonStyle
                                index={index}
                                disabled
                                onClick={handleStep(index)}
                                completed={isStepComplete(index)}
                                stepcomplited={completed}
                                nextstep={completedSteps()}
                                {...buttonProps}
                            >
                                <StepLabel
                                    StepIconComponent={QontoStepIcon}
                                ></StepLabel>
                            </StepButtonStyle>
                            <LabelStep>{label}</LabelStep>
                        </Step>
                    );
                })}
            </StepperStyle>
            <div>
                {allStepsCompleted() ? (
                    <div>
                        <Typography className={classes.instructions}>
                            התוכנית אושרה בתאריך:
                        </Typography>
                        <Button onClick={handleReset}>Reset</Button>
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
                                <div>{getStepContent(activeStep)}</div>
                                <div>26.11.2011</div>
                            </div>
                        </Typography>
                        {/* <div>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.button}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                Next
                            </Button>

                            {activeStep !== steps.length &&
                                (completed.has(activeStep) ? (
                                    <Typography
                                        variant="caption"
                                        className={classes.completed}
                                    >
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleComplete}
                                    >
                                        {completedSteps() === totalSteps() - 1
                                            ? 'Finish'
                                            : 'Complete Step'}
                                    </Button>
                                ))}
                        </div> */}
                    </div>
                )}
            </div>
        </div>
    );
};
