import React from "react";
import PropTypes from "prop-types";
import { UserSelectors } from "redux/selectors";

const AddComment = ({ submit }) => {
    const { user } = UserSelectors();
    const [state, setState] = React.useState({ content: "", name: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState((pv) => ({ ...pv, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(state).then(() => setState((pv) => ({ ...pv, content: "" })));
    };

    const { content, alias } = state;

    return (
        <form
            className="add-comment"
            id="newCommentform"
            method="post"
            onSubmit={handleSubmit}
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
                    onChange={handleChange}
                />
            </div>
            {!user.name && (
                <div className="form-group">
                    <label className="sr-only">כינוי</label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        name="name"
                        placeholder="כינוי"
                        value={alias}
                        onChange={handleChange}
                    />
                </div>
            )}

            <button type="submit" className="btn btn-success float-left">
                שליחה
            </button>
        </form>
    );
};

AddComment.propTypes = {
    submit: PropTypes.func,
    me: PropTypes.object,
};

export default AddComment;
