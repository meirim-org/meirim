import { useSelector } from 'react-redux'

const Selectors = () => {
	const modalType = useSelector(
		(state) => state.modal.modalType
	)
	const open = useSelector(
		(state) => state.modal.open
	)

	return {
		modalType,
		open
	}
}

export default Selectors