import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
	name: 'modal',
	initialState: {
		open: false,
		modalType: '',
		modalProps: {}
	},
	reducers: {
		openModal(state, type) {
			state.modalType = type.payload.modalType;
			state.modalProps = type.payload.modalProps;
			state.open = true;
		},
		closeModal(state) {
			state.modalType = '';
			state.modalProps = {};
			state.open = false;
		}
	}
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;