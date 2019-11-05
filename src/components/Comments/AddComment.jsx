import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

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
        // a callback function
        const { submit } = this.props;
        e.preventDefault();

        submit(this.state)
            .then(()=>this.setState({content:''}))
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
                <div className="form-group">
                    <br />
                    <label className="sr-only">Password</label>
                    <textarea
                        value={content}
                        required
                        placeholder="מדוע?"
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
                    שליחה
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
