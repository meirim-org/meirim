import { useSelector } from 'react-redux';

const Selectors = () => {
	const comments = useSelector(
		(state) => state.comments.data
	);

	return {
		comments
	};
};

export default Selectors;