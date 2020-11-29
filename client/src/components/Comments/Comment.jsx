import React from 'react';
import PropTypes from 'prop-types';
import avatar from 'assets/logo.png';

const Comment = ({ comment }) => {
	const { person, content } = comment

	return (
		<li className="comment-main-level">
			<div className="comment-avatar">
				<img src={avatar} alt="avatar" />
			</div>
			<div className="comment-box">
				<div className="comment-head">
					<h6 className="comment-name">
						<a href={'/profile/' + person.id}>
							{person.alias || 'אנונימי'}{' '}
						</a>
					</h6>
				</div>
				<div className="comment-content"> {content} </div>
			</div>
		</li>
	);
};

Comment.propTypes = {
	comment: PropTypes.object.isRequired
};

export default Comment;
