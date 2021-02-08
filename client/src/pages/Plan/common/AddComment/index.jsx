import React from "react";
import PropTypes from "prop-types";
import { Button } from "shared";
import t from "locale/he_IL";
import * as SC from "./style";

const AddComment = ({ isNewCommentOpen, newCommentViewHandler }) => {
    return (
        <Button
            id="add-opinion"
            text={t.addNewComment}
            iconBefore={<SC.CommentIcon />}
            small
            altColor
            active={isNewCommentOpen}
            onClick={newCommentViewHandler}
        />
    );
};

AddComment.propTypes = {
    isNewCommentOpen: PropTypes.bool,
    newCommentViewHandler: PropTypes.func.isRequired,
};

export default AddComment;
