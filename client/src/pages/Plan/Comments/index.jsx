import React, {useState} from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Chart} from "react-charts";
import {Badge, Radio} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";

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
    const opinions = [
        {
            name: 'מיקי זוהר',
            timeStamp: 1606860321000
        }
    ]

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

    const daysPassed = (date) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const today = Date.now();

        return ` ${Math.round(Math.abs((today - date) / oneDay))} `;
    }


    return (
        <>
            <SC.ButtonWrapper>
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

            {opinions.map((opinion, idx) => (
                <TabBox isOpinion={true} disabled={newOpinion} key={idx}>
                    <SC.Header>
                        <SC.FirstSide>
                            <Typography
                                variant="menuTitle"
                                mobileVariant="menuTitle"
                                component="span"
                                color={theme.palette.green['text2']}
                            >
                                {t.review}
                            </Typography>
                            <Typography
                                variant="highlightedText"
                                mobileVariant="highlightedText"
                                component="span"
                                color={theme.palette.black}
                            >
                                {opinion.name}
                            </Typography>
                        </SC.FirstSide>
                        <SC.SecondSide>
                            <Typography
                                variant="light"
                                mobileVariant="light"
                                component="span"
                                color={theme.palette.gray['main']}
                            >
                                לפני
                                {daysPassed(opinion.timeStamp)}
                                ימים
                            </Typography>
                        </SC.SecondSide>
                    </SC.Header>
                    <SC.Text>
                        <Typography
                            variant="paragraphText"
                            mobileVariant="paragraphText"
                            component="p"
                            color={theme.palette.black}
                        >
                            לורם איפסום דולור סיט אמט,
                            קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט
                            דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.
                            נולום ארווס סאפיאן - פוסיליס קוויס, אקווזמן ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש.
                            תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.
                        </Typography>
                    </SC.Text>
                    <SC.Like>
                        <Button
                            id="like"
                            textColor={theme.palette.black}
                            text={t.iLike}
                            onClick={() => ''}
                            simple
                            iconBefore={<SC.LikeIcon/>}
                        />
                        <Badge
                            badgeContent={'3'}
                        />
                    </SC.Like>
                    <SC.AddComment>
                        <Button
                            id="add-response"
                            textColor={theme.palette.black}
                            text={t.addAResponse}
                            onClick={() => ''}
                            simple
                            iconBefore={<SC.CommentIcon/>}
                        />
                    </SC.AddComment>
                </TabBox>
            ))}

        </>
    )
};

export default Comments;
