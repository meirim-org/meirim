import { useSelector } from 'react-redux';

const Selectors = () => {
	const plans = useSelector((state) =>
		state.alerts.list.filter((item) => item.type === 'plan')
	);
	const trees = useSelector((state) =>
		state.alerts.list.filter((item) => item.type === 'tree')
	);

	const list = useSelector((state) => state.alerts.list);

	return {
		plans,
		trees,
		list,
	};
};

export default Selectors;
