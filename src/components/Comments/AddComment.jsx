import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import Fab from "@material-ui/core/Fab";

import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbUpDown from "@material-ui/icons/ThumbsUpDown";
import Star from "@material-ui/icons/Star";

class AddComment extends Component {
    state = {
        content: "",
        alias: ""
    };

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = e => {
        const { submit } = this.props;
        e.preventDefault();

        submit(this.state);
        // // api.post("/comment/" + this.state.id, { content, alias, person_id: id })
        //     .then(res => {
        //         this.setState({ done: true });
        //         this.handleCommentPublished(res.data);
        //     })
        //     .catch(error => this.setState({ error }));
    };

    render() {
        const { me } = this.props;
        const { content, alias } = this.state;
        return (
            <form
                className="add-comment"
                id="newCommentform"
                method="post"
                onSubmit={this.handleSubmit}
            >
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
                {/* <Fab
                    variant="extended"
                    size="small"
                    color="secondary"
                    aria-label="Add"
                >
                    <ThumbUp /> כן
                </Fab>
                <Fab
                    variant="extended"
                    size="small"
                    color="secondary"
                    aria-label="Add"
                >
                    <ThumbUpDown /> אולי
                </Fab>
                <Fab
                    variant="extended"
                    size="small"
                    color="secondary"
                    aria-label="Add"
                >
                    <ThumbDown /> לא
                </Fab> */}
                <div className="form-group">
                    <br />
                    <label className="sr-only">Password</label>
                    <textarea
                        value={content}
                        required
                        placeholder=""
                        name="content"
                        className="form-control"
                        rows="1"
                        onChange={this.handleChange}
                    />
                </div>
                {!me.alias && (
                    <div className="form-group">
                        <label className="sr-only">כינוי</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            name="alias"
                            placeholder="כינוי"
                            value={alias}
                            onChange={this.handleChange}
                        />
                    </div>
                )}

                <button type="submit" className="btn btn-success float-left">
                    הוספה
                </button>
            </form>
        );
    }
}

AddComment.propTypes = {
    submit: PropTypes.func,
    me: PropTypes.object
};

export default AddComment;
