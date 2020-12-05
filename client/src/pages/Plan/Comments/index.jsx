import React from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Chart} from "react-charts";
import { Badge } from '@material-ui/core';
import {useTheme} from "@material-ui/styles";

const Comments = () => {
    const theme = useTheme();

    return (
        <>
            <SC.ButtonWrapper>
                <Button
                    id="add-comment"
                    text={t.addNewComment}
                    iconBefore={<SC.CommentIcon/>}
                    small
                    altColor
                    onClick={() => ''}/>
            </SC.ButtonWrapper>
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
                        קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.
                        נולום ארווס סאפיאן - פוסיליס קוויס, אקווזמן ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.
                    </Typography>
                </SC.Text>
                <SC.Like>
                    <Button
                        id="like"
                        textColor={theme.palette.black}
                        text={t.iLike}
                        onClick={()=>''}
                        simple
                        iconBefore={<SC.LikeIcon />}
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
                        onClick={()=>''}
                        simple
                        iconBefore={<SC.CommentIcon />}
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
                        קונסקטורר אדיפיסינג אלית. סת אלמנקום ניסי נון ניבאה. דס איאקוליס וולופטה דיאם. וסטיבולום אט דולור, קראס אגת לקטוס וואל אאוגו וסטיבולום סוליסי טידום בעליק.
                        נולום ארווס סאפיאן - פוסיליס קוויס, אקווזמן ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.
                    </Typography>
                </SC.Text>
                <SC.Like>
                    <Button
                        id="like"
                        textColor={theme.palette.black}
                        text={t.iLike}
                        onClick={()=>''}
                        simple
                        iconBefore={<SC.LikeIcon />}
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
                        onClick={()=>''}
                        simple
                        iconBefore={<SC.CommentIcon />}
                    />
                </SC.AddComment>
            </TabBox>
        </>
    )
};

export default Comments;
