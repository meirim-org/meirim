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