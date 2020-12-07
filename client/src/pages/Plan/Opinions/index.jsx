import React, {useState} from 'react';
import {Button, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Chart} from "react-charts";
import {Radio} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";
import Opinion from "./Opinion";

const Comments = () => {
    const theme = useTheme();
    const [newOpinion, setNewOpinion] = useState(false)
    const [value, setValue] = useState(null)
    const [error, setError] = useState(false);

    const radioButtons = [
        {
            value: 'improvement-proposal',
            text: t.improvementProposal
        },
        {
            value: 'review',
            text: t.review
        },
        {
            value: 'general-opinion',
            text: t.generalOpinion
        },

    ]

    const opinions = []

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const printRadioClass = (selectedValue, radioValue) => {
        let classes = [];

        if (selectedValue === radioValue) {
            classes.push('active');
        }

        if (error) {
            classes.push('error');
        }

        return classes.join();
    }

    return (
        <>
            <SC.ButtonWrapper className={!opinions.length ? 'no-opinions' : ''}>
                <Button
                    id="add-opinion"
                    text={t.addAnOpinion}
                    iconBefore={<SC.CommentIcon/>}
                    small
                    altColor
                    active={newOpinion}
                    onClick={() => setNewOpinion(!newOpinion)}
                />
            </SC.ButtonWrapper>
            {newOpinion
                ?
                <>
                    <SC.FormControl component="fieldset">
                        <SC.RadioGroup aria-label="comment-type" name="comment-type" value={value}
                                       onChange={handleChange} row>
                            {radioButtons.map((radioButton, idx) => (
                                <SC.FormControlLabelWrapper key={idx}>
                                    <SC.FormControlLabel
                                        className={printRadioClass(value, radioButton.value)}
                                        value={radioButton.value}
                                        control={<Radio/>}
                                        label={radioButton.text}
                                    />
                                </SC.FormControlLabelWrapper>
                            ))}
                        </SC.RadioGroup>
                        {error
                            ?
                            <SC.ErrorWrapper>
                                <Typography
                                    variant="chipsAndIconButtons"
                                    mobileVariant="chipsAndIconButtons"
                                    component="span"
                                    color={theme.palette.red}
                                >
                                    {t.chooseType}
                                </Typography>
                            </SC.ErrorWrapper> :
                            null
                        }
                    </SC.FormControl>
                    <SC.FormControl fullWidth={true}>
                        <SC.TextareaAutosize disabled={error} aria-label={t.emptyTextarea} rowsMin={5}/>
                    </SC.FormControl>
                    <SC.addOpinionButtonWrapper>
                        <Button
                            id="close-new-opinion"
                            text={t.close}
                            simple
                            small
                            textColor={theme.palette.black}
                            onClick={() => setNewOpinion(false)}
                        />
                        <Button
                            id="send-new-opinion"
                            text={t.send}
                            fontWeight={600}
                            small
                            simple
                            onClick={() => ''}
                            disabled={error}
                        />
                    </SC.addOpinionButtonWrapper>
                </>
                :
                null
            }

            {opinions.length
                ?
                opinions.map((opinion, idx) => (
                    <Opinion opinion={opinion} disabled={newOpinion} key={idx} />
                ))
                :
                <SC.NoOpinionsWrapper>
                    <Typography
                        variant="planDetailTitle"
                        mobileVariant="cardTitle"
                        component="span"
                        color={theme.palette.black}
                    >
                        {t.startDiscussion}
                    </Typography>
                    <br />
                    <Typography
                        variant="paragraphText"
                        mobileVariant="paragraphText"
                        component="span"
                        color={theme.palette.black}
                    >
                        {t.shareThought}
                    </Typography>
                </SC.NoOpinionsWrapper>
            }

        </>
    )
};

export default Comments;
