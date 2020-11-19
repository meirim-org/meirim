export const firstStepValidation = ({ name, email, password }) => {
	const isValidEmail =  Boolean(email)
	const isValidName =  Boolean(name)
	const isValidPassword = password.length >= 6 

	return { isValidEmail, isValidName, isValidPassword }
}

export const formValidation = ({ name, email, password, dirtyInputs, onFocusInput }) => {
	const isValidEmail = onFocusInput.email  || Boolean(email)? true : !dirtyInputs.email
	const isValidName = onFocusInput.name  || Boolean(name) ? true : !dirtyInputs.name
	const isValidPassword = onFocusInput.password  || password.length >= 6 ? true : !dirtyInputs.password

	return { isValidEmail, isValidName, isValidPassword }
}

export const getFormErrors = ({ isValidEmail, isValidName, isValidPassword }) => {
	const emailError = { isValid: isValidEmail, message: isValidEmail? '' : 'שדה חובה' }
	const nameError = { isValid: isValidName, message: isValidName ? '' : 'שדה חובה' }
	const passwordError = { isValid: isValidPassword, message: isValidPassword ? '' : 'לפחות ששה תווים' }

	return { emailError, nameError, passwordError }
}
