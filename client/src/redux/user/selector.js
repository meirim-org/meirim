import { useSelector } from 'react-redux';

const Selectors = () => {
	const isAuthenticated = useSelector(
		(state) => state.user.isAuthenticated
	);
	const user = useSelector(
		(state) => state.user.user
	);

	const isAdmin = useSelector( 
		(state) => {
			return state.user.isAdmin;
		}
	);

	const favoritePlans = useSelector(
		(state) => state.user.favoritePlans
	);

	return {
		isAuthenticated,
		user,
		isAdmin,
		favoritePlans
	};
};

export default Selectors;