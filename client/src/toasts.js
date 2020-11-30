import { toast } from 'react-toastify'

const failConfiguration = {
	position: 'bottom-center',
	autoClose: false,
	hideProgressBar: true,
	closeOnClick: true,
	draggable: true,
}

const successConfiguration = {
	position: 'bottom-center',
	closeOnClick: true,
	draggable: true,
}

const ServerFailToast =	toast.error('מתנצלים, יש שגיאה בצד שלנו. נא לנסות שוב', {
	toastId: '504message',
	...failConfiguration
}) 

export const wrongLoginCredsToast = () => 
	toast.error('הסיסמה או שם המשתמש אינם נכונים', {
		toastId: '403message',
		...failConfiguration
	})

export const serverErrorToast = () => ServerFailToast

export const copiedToClipboard = () =>
	toast.success('הועתק בהצלחה!', {
		toastId: 'copiedToClipboardMessage',
		...successConfiguration
	}) 

export const FailSubscribeUserToPlan = () => ServerFailToast

export const SuccessSubscribeUserToPlan = () =>
	toast.success('התוכנית נשמרה בהצלחה!', {
		toastId: 'SuccessSubscribeUserToPlan',
		...successConfiguration
	}) 
 
export const SuccessAddComment = () =>
	toast.success('התגובה נוספה בהצלחה!', {
		toastId: 'SuccessSubscribeUserToPlan',
		...successConfiguration
	}) 
 
export const FailAddComment = () => ServerFailToast