const validateName = (n) => Boolean(n);

const validateEmail = (e) => Boolean(e);

const validatePassword = (p) => Boolean(p);

export const validateForm = ({ name, email, password }) => {
  const isNameValid = validateName(name);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);

  return isNameValid && isEmailValid && isPasswordValid;
};
