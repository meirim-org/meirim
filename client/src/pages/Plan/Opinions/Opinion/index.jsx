import React, {useState} from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Badge, Radio} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";
import PropTypes from "prop-types";
import {daysPassed} from 'helpers';

const Opinion = ({
    opinion,
    disabled,
    key
}) => {
    const [newComment, setNewComment] = useState(false)
    const theme = useTheme();

    const comments = [
        {
            name: 'אורן חזן',
            timeStamp: 1606860321000,
            text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי הועניב היושבב שערש שמחויט - שלושע ותלברו חשלו שעותלשך וחאית נובש ערששף. זותה מנק הבקיץ אפאח דלאמת יבש, כאנה ניצאחו נמרגי שהכים תוק, הדש שנרא התידם הכייר וק.'
        },
        {
            name: 'דוד ביטן',
            timeStamp: 1606860321000,
            text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי הועניב היושבב שערש שמחויט - שלושע ותלברו חשלו שעותלשך וחאית נובש ערששף. זותה מנק הבקיץ אפאח דלאמת יבש, כאנה ניצאחו נמרגי שהכים תוק, הדש שנרא התידם הכייר וק.'
        }
    ]

    return (
        <>
            <TabBox isOpinion={true} disabled={disabled} key={key}>
                <SC.Header>
                    <SC.FirstSide>
                        <Typography
                            variant="menuTitle"
                            mobileVariant="menuTitle"
                            component="span"
                            color={theme.palette.green['text2']}
                        >
                            {opinion.type}
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
                        {opinion.text}
                    </Typography>
                </SC.Text>
                <SC.Like>
                    <Button
                        id={"like-" + key}
                        textColor={theme.palette.black}
                        text={t.iLike}
                        onClick={() => ''}
                        simple
                        iconBefore={<SC.LikeIcon/>}
                    />
                    <Badge
                        badgeContent={opinion.likes.toString()}
                    />
                </SC.Like>
                <SC.AddComment className={newComment ? 'active' : ''}>
                    <Button
                        id={"add-response-" + key}
                        textColor={theme.palette.black}
                        text={t.addAResponse}
                        onClick={() => setNewComment(true)}
                        simple
                        iconBefore={<SC.CommentIcon/>}
                    />
                </SC.AddComment>

                {comments.length
                    ?
                    comments.map((comment, idx) => (
                         <Comment comment={comment} key={idx} />
                     ))
                    :
                    null
                }

            </TabBox>

            {newComment
                ?
                <div>is</div>
                :
                null
            }

        </>
    )
};

Opinion.defaultProps = {
    disabled: false,
};

Opinion.propTypes = {
    opinion: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    key: PropTypes.string.isRequired,
};

export default Opinion;
