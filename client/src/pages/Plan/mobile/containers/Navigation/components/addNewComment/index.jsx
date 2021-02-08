import React from "react";
import { useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import { BottomNavigationAction } from "@material-ui/core";
import t from "locale/he_IL";

const AddNewComment = ({ newCommentViewHandler }) => {
    const { id: planId } = useParams();
    const history = useHistory();

    return (
        <BottomNavigationAction
            onClick={() => {
                history.push(`/plan/${planId}/comments`);
                newCommentViewHandler();
            }}
            label={t.addNewComment}
            icon={<ChatBubbleOutlineIcon fontSize={"small"} />}
        />
    );
};

AddNewComment.propTypes = {
    newCommentViewHandler: PropTypes.func.isRequired,
};

export default AddNewComment;
