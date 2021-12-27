import { useSelector } from 'react-redux';

const Selectors = () => {
	const isAuthenticated = useSelector(
		(state) => state.user.isAuthenticated
	);
	const user = useSelector(
		(state) => state.user.user
	);

	const favoritePlans = useSelector(
		(state) => state.user.favoritePlans
	);

	return {
		isAuthenticated,
		user,
		favoritePlans
	};
};

export default Selectors;