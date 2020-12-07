import React, {useState} from 'react';
import {Button, TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
import {Badge, TextareaAutosize} from '@material-ui/core';
import {useTheme} from "@material-ui/styles";
import PropTypes from "prop-types";
import {daysPassed} from 'helpers';
import Comment from "./Comment";

const Opinion = ({
                     opinion,
                     disabled,
                     key
                 }) => {
    const [newComment, setNewComment] = useState(false)
    const theme = useTheme();

    const comments = opinion.comments;

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
                <SC.CommentsWrapper>

                    {newComment
                        ?
                        <SC.addCommentWrapper>
                            <SC.FormControl fullWidth={true}>
                                <TextareaAutosize aria-label={t.emptyTextarea} rowsMin={5}/>
                            </SC.FormControl>
                            <SC.addCommentButtonWrapper>
                                <Button
                                    id="close-new-opinion"
                                    text={t.close}
                                    simple
                                    small
                                    textColor={theme.palette.black}
                                    onClick={() => setNewComment(false)}
                                />
                                <Button
                                    id="send-new-opinion"
                                    text={t.send}
                                    fontWeight={600}
                                    small
                                    simple
                                    onClick={() => ''}
                                />
                            </SC.addCommentButtonWrapper>

                        </SC.addCommentWrapper>
                        :
                        null
                    }

                    {comments.length
                        ?
                        comments.map((comment, idx) => (
                            <Comment comment={comment} key={idx}/>
                        ))
                        :
                        null
                    }
                </SC.CommentsWrapper>

            </TabBox>

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
