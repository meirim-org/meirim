import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink as Link } from "react-router-dom";
import _ from "lodash";

import Comment from "./Comment";
import AddComment from "./AddComment";
import api from "../../services/api";

import "bootstrap/dist/css/bootstrap.css";
import "./Comments.css";

const signInURL = {
    pathname: "/sign/in",
    state: {
        redirectTo: window.location.pathname
    }
};

class Comments extends Component {
    state = {
        me: {},
        comments: [],
        isLoading: true,

        error: false
    };

    componentDidMount() {
        const { planId } = this.props;

        return api
            .get("/comment/" + planId)
            .then(comments => {
                this.setState({
                    comments: comments.data,
                    me: comments.me,
                    isLoading: false
                });
            })
            .catch(error => this.setState({ error }));
    }

    handleCommentPublished(data) {
        var newComment = _.merge(data, {
            person: {
                alias: this.state.alias || this.state.me.alias,
                id: this.state.me.id
            }
        });
        // if there hasnt been an alias for current user
        const newMe = this.state.me;
        newMe.alias = newMe.alias || data.person.alias;
        this.setState({
            comments: this.state.comments.concat([newComment]),
            content: "",
            me: newMe
        });
        document.getElementByName("newCommentform").reset();
    }

    handleSubmit = state => {
        const { planId, me } = this.props;
        const { content, alias } = state;

        api.post("/comment/" + planId, { content, alias, person_id: me.id })
            .then(res => {
                this.setState({ done: true });
                this.handleCommentPublished(res.data);
            })
            .catch(error => this.setState({ error }));
    };

    render() {
        const { me } = this.props;
        const { comments } = this.state;

        return (
            <Fragment>
                {/* {<AddComment me={me} submit={this.handleSubmit} />} */}
                {!!comments.length && (
                    <ul id="comments-list" className="comments-list ">
                        {comments.map((comment, idx) => (
                            <Comment id={idx} comment={comment} />
                        ))}
                    </ul>
                )}
                {!comments.length && <div>עדיין אין תגובות</div>}
                {/* {!me.id && (
                    <div className="text-center container">
                        מה דעתך על התוכנית?
                        <br />
                        <small>יש להירשם כדי להגיב ולהשתתף בדיון</small>
                        <br />
                        <Link to="/">
                            <button className="btn btn-success">
                                חשבון חדש
                            </button>
                        </Link>
                        או
                        <Link to={signInURL}>
                            <button className="btn btn-primary">
                                חשבון קיים
                            </button>
                        </Link>
                    </div>
                )} */}
            </Fragment>
        );
    }
}

Comments.propTypes = {
    planId: PropTypes.number,
    me: PropTypes.object
};

export default Comments;
