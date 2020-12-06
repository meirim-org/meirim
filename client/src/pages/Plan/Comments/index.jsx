import React, {useState} from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Chart} from "react-charts";
import {Badge, Radio, TextareaAutosize} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";

const Comments = () => {
    const theme = useTheme();
    const [newComment, setNewComment] = useState(false)
    const [value, setValue] = useState('improvement-proposal')
    const radioButtons = [
        {
            value: 'improvement-proposal',
            text:  t.improvementProposal
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
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <>
            <SC.ButtonWrapper>
                    <Button
                        id="add-comment"
                        text={t.addNewComment}
                        iconBefore={<SC.CommentIcon/>}
                        small
                        altColor
                        active={newComment}
                        onClick={() => setNewComment(!newComment)}
                    />
            </SC.ButtonWrapper>
            {newComment
                ?
                <>
                    <SC.FormControl component="fieldset">
                        <SC.RadioGroup aria-label="comment-type" name="comment-type" value={value} onChange={handleChange} row>
                            {radioButtons.map((radioButton, idx) => (
                                <SC.FormControlLabelWrapper>
                                    <SC.FormControlLabel
                                        key={idx}
                                        className={value === radioButton.value ? 'active' : null}
                                        value={radioButton.value}
                                        control={<Radio />}
                                        label={radioButton.text}
                                    />
                                </SC.FormControlLabelWrapper>
                            ))}
                        </SC.RadioGroup>
                    </SC.FormControl>
                    <SC.FormControl fullWidth={true}>
                        <TextareaAutosize aria-label={t.emptyTextarea} rowsMin={5}/>
                    </SC.FormControl>
                    <SC.addCommentButtonWrapper>
                        <Button
                            id="close-new-comment"
                            text={t.close}
                            simple
                            small
                            altColor
                            onClick={() => ''}
                        />
                        <Button
                            id="send-new-comment"
                            text={t.send}
                            small
                            simple
                            altColor
                            onClick={() => ''}
                        />
                    </SC.addCommentButtonWrapper>
                </>
                :
                null
            }

            <TabBox isComment={true}>
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
                            אביגיל נחשון
                        </Typography>
                    </SC.FirstSide>
                    <SC.SecondSide>
                        <Typography
                            variant="light"
                            mobileVariant="light"
                            component="span"
                            color={theme.palette.gray['main']}
                        >
                            לפני 2 ימים
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
            <TabBox isComment={true}>
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
                            אביגיל נחשון
                        </Typography>
                    </SC.FirstSide>
                    <SC.SecondSide>
                        <Typography
                            variant="light"
                            mobileVariant="light"
                            component="span"
                            color={theme.palette.gray['main']}
                        >
                            לפני 2 ימים
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
        </>
    )
};

export default Comments;
