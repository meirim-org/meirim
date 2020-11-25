import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
	name: 'modal',
	initialState: {
		open: false
	},
	reducers: {
		openModal(state) {
			state.open = true
		},
		closeModal(state) {
			state.open = false
		}
	}

})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer