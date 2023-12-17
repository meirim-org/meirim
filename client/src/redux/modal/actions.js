import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from './slice';

const Actions = () => {
	const dispatch = useDispatch();
	const openRegister = useCallback(
		() => dispatch(openModal({ modalType: 'register' })),
		[dispatch]
	);

	const openLogin = useCallback(
		() => dispatch(openModal({ modalType: 'login' })),
		[dispatch]
	);

	const openProfile = useCallback(
		() => dispatch(openModal({ modalType: 'profile' })),
		[dispatch]
	);

	const close = useCallback(() => dispatch(closeModal()), [dispatch]);

	return { openRegister, openLogin, openProfile, close };
};

export default Actions;
