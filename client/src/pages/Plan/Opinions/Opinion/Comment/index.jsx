import React from 'react';
import {TabBox, Typography} from 'shared'
import t from "locale/he_IL";
import * as SC from './style';
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
            <SC.CommentBox key={key}>
                <SC.Header>
                    <SC.ArrowIcon />
                    <Typography
                            variant="smallTitle"
                            mobileVariant="smallTitle"
                            component="span"
                            color={theme.palette.black}
                        >
                            {comment.name}
                        </Typography>
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
                </SC.Header>
                <SC.Text>
                    <Typography
                        variant="paragraphTextLight"
                        mobileVariant="paragraphTextLight"
                        component="p"
                        color={theme.palette.black}
                    >
                        {comment.text}
                    </Typography>
                </SC.Text>
            </SC.CommentBox>

        </>
    )
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
};

export default Comment;
