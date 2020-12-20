import { useSelector } from 'react-redux';

const Selectors = () => {
	const plan = useSelector(
		(state) => state.plan.data
	);

	return {
		plan
	};
};

export default Selectors;