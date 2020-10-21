import React from "react";
import PropTypes from "prop-types";

import avatar from "../../assets/logo.png";

const Comment = function Comment(props) {
    const { comment } = props;
    return (
        <li className="comment-main-level">
            <div className="comment-avatar">
                <img src={avatar} alt="avatar" />
            </div>
            <div className="comment-box">
                <div className="comment-head">
                    <h6 className="comment-name">
                        <a href={"/profile/" + comment.person.id}>
                            {comment.person.alias || "אנונימי"}{" "}
                        </a>
                    </h6>
                </div>
                <div className="comment-content"> {comment.content} </div>
            </div>
        </li>
    );
};

Comment.propTypes = {
    comment: PropTypes.object
};
export default Comment;
