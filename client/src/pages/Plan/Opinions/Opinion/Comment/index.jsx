import React from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Badge} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";
import PropTypes from "prop-types";
import {daysPassed} from 'helpers';

const Comment = ({
    comment,
    key
}) => {
    const theme = useTheme();

    return (
        <>
            <TabBox key={key}>
                <SC.Header>
                    <SC.FirstSide>
                        <Typography
                            variant="menuTitle"
                            mobileVariant="menuTitle"
                            component="span"
                            color={theme.palette.green['text2']}
                        >
                            {comment.type}
                        </Typography>
                        <Typography
                            variant="highlightedText"
                            mobileVariant="highlightedText"
                            component="span"
                            color={theme.palette.black}
                        >
                            {comment.name}
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
                            {daysPassed(comment.timeStamp)}
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
                        {comment.text}
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
                        badgeContent={comment.likes.toString()}
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

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
};

export default Comment;
