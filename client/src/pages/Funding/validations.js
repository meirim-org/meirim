export const paymentRequestValidation = ({ amount, termsAccepted }) => {
    const isValidAmount = Number.isInteger(amount) && parseInt(amount) > 0;
    const isValidAcceptedTerms = termsAccepted || false;

    return { isValidAmount, isValidAcceptedTerms };
};

const termsNotAccepted = "נא לאשר את תנאי התמיכה";
const undefinedAmountMessage = "נא לבחור סכום לתמיכה";
const emptyAmountMessage = "נא להזין סכום לתמיכה";
const emptyString = "";

export const getFormErrors = ({
    validations: { isValidAmount, isValidAcceptedTerms },
    values: { amount, termsAccepted },
}) => {
    let amountError = {
        isValid: isValidAmount,
        message: isValidAmount
            ? emptyString
            : Number.isInteger(amount)
            ? emptyAmountMessage
            : undefinedAmountMessage,
    };
    const termsAcceptedError = {
        isValid: isValidAcceptedTerms,
        message: isValidAcceptedTerms ? emptyString : termsNotAccepted,
    };

    return { amountError, termsAcceptedError };
};
