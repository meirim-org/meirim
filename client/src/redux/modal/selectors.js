import { useSelector } from 'react-redux';

const Selectors = () => {
	const modalType = useSelector(
		(state) => state.modal.modalType
	);
	const open = useSelector(
		(state) => state.modal.open
	);
	const modalProps = useSelector(
		(state) => state.modal.modalProps
	);

	return {
		modalProps,
		modalType,
		open
	};
};

export default Selectors;