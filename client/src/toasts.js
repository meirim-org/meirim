import { toast } from 'react-toastify';

const failConfiguration = {
	position: 'bottom-center',
	autoClose: false,
	hideProgressBar: true,
	closeOnClick: true,
	draggable: true,
};

const successConfiguration = {
	position: 'bottom-center',
	closeOnClick: true,
	draggable: true,
};

const ServerFailToast =	(id) => toast.error('מתנצלים, יש שגיאה בצד שלנו. נא לנסות שוב', {
	toastId: id,
	...failConfiguration
}); 

export const wrongLoginCredsToast = () => 
	toast.error('הסיסמה או שם המשתמש אינם נכונים', {
		toastId: '403message',
		...failConfiguration
	});

export const wrongLoginNotActivatedToast = () => 
	toast.error('יש לאמת את כתובת המייל לפני תחילת השימוש', {
		toastId: '401message',
		...failConfiguration
	});	

export const externalPaymentErrorToast = () =>
	toast.error('מתנצלים, יש תקלה בשירות התשלומים. נשמח אם תנסו שוב במועד מאוחר', {
		toastId: '500message',
		...failConfiguration
	})

export const serverErrorToast = () => ServerFailToast('serverErrorToast');

export const copiedToClipboard = () =>
	toast.success('הועתק בהצלחה!', {
		toastId: 'copiedToClipboardMessage',
		...successConfiguration
	}); 

export const FailSubscribeUserToPlan = () => ServerFailToast('faileSubscribeUsertoPlan');

export const SuccessUnsubscribeUserToPlan = () =>
	toast.success('התוכנית נמחקה מרשימת המועדפים בהצלחה', {
		toastId: 'SuccessSubscribeUserToPlan',
		...successConfiguration
	}); 

export const SuccessSubscribeUserToPlan = () =>
	toast.success('התוכנית נשמרה בהצלחה!', {
		toastId: 'SuccessSubscribeUserToPlan',
		...successConfiguration
	}); 
 
export const SuccessAddComment = () =>
	toast.success('התגובה נוספה בהצלחה!', {
		toastId: 'SuccessSubscribeUserToPlan',
		...successConfiguration
	}); 
 
export const FailAddComment = () => ServerFailToast('faileAddComment');
