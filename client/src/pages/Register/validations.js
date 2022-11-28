import { validateEmail } from '../../validations';

const inValidEmailMessage = 'מייל לא תקין';
const emptyInputMessage = 'שדה חובה';
const shortPasswordMessage = 'לפחות ששה תווים';
const emptyTypeMessage = 'אנא הוסיפו סוג משתמש';

export function formValidation(values) {
	return {
		name: nameError(values.name),
		password: passwordError(values.password),
		email: emailError(values.email),
		type: typeError(values.type),
	};
}

function nameError(name) {
	if (!name) {
		return emptyInputMessage;
	}

	return '';
}

function passwordError(password) {
	if (!password) {
		return emptyInputMessage;
	} else if (password.length < 6) {
		return shortPasswordMessage;
	}

	return '';
}

function emailError(email) {
	if (!email) {
		return emptyInputMessage;
	} else if (!validateEmail(email)) {
		return inValidEmailMessage;
	}

	return '';
}

function typeError(type) {
	if (!type) {
		return emptyTypeMessage;
	}

	return '';
}

export function fieldError(field, validations, touchedInputs, focusedInput) {
	if (touchedInputs[field] && focusedInput !== field) {
		return validations[field];
	} else {
		return '';
	}
}
