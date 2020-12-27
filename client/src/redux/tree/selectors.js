import { useSelector } from 'react-redux';

const Selectors = () => {
	const treeData = useSelector(
		(state) => state.tree.treeData
	);

	return {
		treeData,
	};
};

export default Selectors;