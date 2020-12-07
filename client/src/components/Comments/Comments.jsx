import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux'
import _ from 'lodash';
import Comment from './Comment';
import AddComment from './AddComment';
import api from 'services/api';
import 'assets/bootstrap.css';
import { openModal } from 'redux/modal/slice'
import './Comments.css';

const Comments = props => {
	const dispatch = useDispatch();
	const [ state, setState ] = React.useState({
		comments: [],
		isLoading: true,
		me: {},
		error: false
	})

	React.useEffect(() => {
		const { planId } = props;
		api.get('/comment/' + planId)
			.then(comments => {
				setState(pv => ({
					...pv,
					comments: comments.data,
					isLoading: false,
					me: comments.me
				}));
			})
			.catch(error => setState(pv => ({ ...pv, error })));
	}, [props.planId])

	const handleCommentPublished = (data) => {
		const newComment = _.merge(data, {
			person: {
				alias: state.me.name,
				id: state.me.id
			}
		});
		const newMe = state.me;
		newMe.name = newMe.name || data.person.name;
		setState(pv => ({
			...pv,
			comments: state.comments.concat([newComment]),
			content: '',
			me: newMe
		}));

		document.getElementByName('newCommentform').reset();
	}

	const handleSubmit = data => {
		const { planId } = props;
		const { me } = state;
		const { content, name } = data;

		return api.post('/comment/' + planId, {
			content,
			alias:  me.name || name,
			person_id: me.id,
			plan_id: planId,
			parent_id: 0
		})
			.then(res => {
				setState(pv => ({ ...pv, done: true }));
				handleCommentPublished(res.data);
			})
			.catch(error => setState(pv => ({ ...pv, error })));
	};

	const { comments, me } = state;
	
	return (
		<Fragment>
			{!me.id && (
				<div className="text-center container">
					<small>יש להתחבר לפני שניתן להגיב</small>
					<br />
					<button className="btn btn-primary" onClick={() => dispatch(openModal({ modalType: 'login' }))}>התחברות</button>
				</div>
			)}
			{me.id && <AddComment submit={handleSubmit} />}
			<ul id="comments-list" className="comments-list ">
				{comments.map((comment, idx) => (
					<Comment key={idx} id={idx} comment={comment} />
				))}
			</ul>
		</Fragment>
	);
}

Comments.propTypes = {
	planId: PropTypes.number,
};

export default Comments;
