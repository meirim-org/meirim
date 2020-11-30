import { toast } from 'react-toastify'

export const wrongLoginCredsToast = () => 
	toast.error('הסיסמה או שם המשתמש אינם נכונים', {
		toastId: '403message',
		position: 'bottom-center',
		autoClose: false,
		hideProgressBar: true,
		closeOnClick: true,
		draggable: true,
	})

export const serverErrorToast = () =>
	toast.error('מתנצלים, יש שגיאה בצד שלנו. נא לנסות שוב', {
		toastId: '504message',
		position: 'bottom-center',
		autoClose: false,
		hideProgressBar: true,
		closeOnClick: true,
		draggable: true,
	})


export const copiedToClipboard = () =>
	toast.success('הועתק בהצלחה!', {
		toastId: 'copiedToClipboardMessage',
		position: 'bottom-center',
		closeOnClick: true,
		draggable: true,
	}) 

export const FailSubscribeUserToPlan = () =>
	toast.error('מתנצלים, יש שגיאה בצד שלנו. נא לנסות שוב', {
		toastId: 'failToSubscribeUserToPlan',
		position: 'bottom-center',
		autoClose: false,
		hideProgressBar: true,
		closeOnClick: true,
		draggable: true,
	})

export const SuccessSubscribeUserToPlan = () =>
	toast.success('התוכנית נשמרה בהצלחה!', {
		toastId: 'SuccessSubscribeUserToPlan',
		position: 'bottom-center',
		closeOnClick: true,
		draggable: true,
	}) 
		
 
 