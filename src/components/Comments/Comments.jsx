import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink as Link } from "react-router-dom";
import _ from "lodash";

import Comment from "./Comment";
import AddComment from "./AddComment";
import api from "../../services/api";

import "../../assets/bootstrap.css";
import "./Comments.css";

const signInURL = {
    pathname: "/sign/in",
    state: {
        redirectTo: window.location.pathname
    }
};

class Comments extends Component {
    state = {
        comments: [],
        isLoading: true,
        me : this.props.me ||{},
        error: false
    };

    componentDidMount() {
        const { planId } = this.props;

        return api
            .get("/comment/" + planId)
            .then(comments => {
                this.setState({
                    comments: comments.data,
                    isLoading: false,
                    me: comments.me
                });
            })
            .catch(error => this.setState({ error }));
    }

    handleCommentPublished(data) {
        var newComment = _.merge(data, {
            person: {
                alias: this.state.me.alias,
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

    handleSubmit = data => {
        const { planId } = this.props;
        const { me } = this.state;
        const { content, alias } = data;

        let aliasush  = me.alias || alias;

        api.post("/comment/" + planId, { content, alias: aliasush, person_id: me.id, plan_id: planId, parent_id:0 })
            .then(res => {
                this.setState({ done: true });
                this.handleCommentPublished(res.data);
            })
            .catch(error => this.setState({ error }));
    };

    render() {
        const { comments, me} = this.state;

        return (
            <Fragment>
                {me.id && <AddComment me={me} submit={this.handleSubmit} />}
                <ul id="comments-list" className="comments-list ">
                    {comments.map((comment, idx) => (
                        <Comment id={idx} comment={comment} />
                    ))}
                </ul>
                {!me.id && (
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
                )}
            </Fragment>
        );
    }
}

Comments.propTypes = {
    planId: PropTypes.number,
    me: PropTypes.object
};

export default Comments;
