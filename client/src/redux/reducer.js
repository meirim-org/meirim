import { combineReducers } from '@reduxjs/toolkit'
import  modalReducer  from './slices'

const rootReducer = combineReducers({
	modal: modalReducer
})

export default rootReducer

