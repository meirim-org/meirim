import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  NavLink as Link
} from "react-router-dom";
import _ from "lodash";

import api from "../services/api";

import avatar from "../assets/logo.png";
import "../assets/bootstrap.css";
import "./Comments.css";

import Moment from "react-moment";

import t from "../locale/he_IL";

class Comments extends Component {
  state = {
    comments: [],
    isLoading: true,
    id: this.props.planId,
    me: {},
    content: "",
    alias: "",
    form: {
      plan_id: this.props.planId,
      parent_id: 0
    },
    signInURL: {
      pathname: "/sign/in",
      state: {
        redirectTo: window.location.pathname
      }
    }
  };
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const { id } = this.state;

    return api
      .get("/comment/" + id)
      .then(comments => {
        this.setState({ comments: comments.data });
        this.setState({ me: comments.me });
        this.setState({ isLoading: false });
      })
      .catch(error => this.setState({ error }));
  }

  render() {
    const { me, id, comments } = this.state || {};

    return (
      <React.Fragment>
        {this.state.me.id && (
          <form
            className="add-comment"
            id="newCommentform"
            method="post"
            onSubmit={this.handleSubmit}
          >
            <input type="hidden" name="parent_id" value="0" />
            <input type="hidden" name="plan_id" value="{id}" />
            <div className="form-group">
              <br />
              <label className="sr-only">Password</label>
              <textarea
                value={this.state.content}
                required
                placeholder="מה דעתך על התוכנית?"
                name="content"
                className="form-control"
                rows="1"
                onChange={this.handleChange}
              />
            </div>
            {!this.state.me.alias && (
              <div className="form-group">
                <label className="sr-only">כינוי</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  name="alias"
                  placeholder="כינוי"
                  value={this.state.me.alias}
                  onChange={this.handleChange}
                />
              </div>
            )}

            <button type="submit" className="btn btn-success float-left">
              שליחה
            </button>
          </form>
        )}
        <ul id="comments-list" className="comments-list ">
          {this.state.comments.map((comment, idx) => {
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
          })}
        </ul>
        {!this.state.me.id && (
          <div className="text-center container">
            מה דעתך על התוכנית?
            <br />
            <small>יש להירשם כדי להגיב ולהשתתף בדיון</small>
            <br />
            <Link to="/">
              <button className="btn btn-success">חשבון חדש</button>
            </Link>
            או
            <Link to={this.state.signInURL}>
              <button className="btn btn-primary">חשבון קיים</button>
            </Link>
          </div>
        )}
      </React.Fragment>
    );
  }

  handleSubmit(e) {
    let newComment = this.state.form;
    newComment.content = this.state.content;
    newComment.alias = this.state.me.alias || this.state.alias;
    newComment.person_id = this.state.me.id;

    e.preventDefault();
    api
      .post("/comment/" + this.state.id, newComment)
      .then(res => {
        this.setState({ done: true });
        this.handleCommentPublished(res.data);
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

  handleChange(event) {
    event.preventDefault();
    let newState = this.state;
    const target = event.target;
    newState[target.name] = target.value;

    this.setState({ newState });

    event.preventDefault();
  }
}

export default Comments;
