import { useSelector } from 'react-redux';

const Selectors = () => {
	const isAuthenticated = useSelector(
		(state) => state.user.isAuthenticated
	);
	const user = useSelector(
		(state) => state.user.user
	);

	return {
		isAuthenticated,
		user
	};
};

export default Selectors;