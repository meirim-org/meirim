import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { EMAIL_SENT_PAGE } from "router/contants";
import { closeModal } from "redux/modal/slice";
import { authenticateEmail, registerUser } from "./controller";
import FirstStepSignup from "./firstStep";
import SecondStepSignup from "./secondStep";
import {
    firstStepValidation,
    formValidation,
    getFormErrors,
} from "./validations";
import { personTypes } from "./constants";
import { useDispatch } from "react-redux";

const SignupForms = () => {
    const dispatch = useDispatch();
    const [firstStepSuccess, setFirstStepSucess] = useState(false);
    const [secondStepSuccess, setSecondStepSucess] = useState(false);
    const [firstStepValues, setFirstStepValues] = useState({
        name: "",
        password: "",
        email: "",
    });
    const [secondStepValues, setSecondStepValues] = useState({
        type: personTypes[0].value,
        aboutme: "",
        address: "",
    });
    const [onFocusInput, setOnFocusInput] = useState({
        name: false,
        password: false,
        email: false,
    });
    const [dirtyInputs, setDirtyInputs] = useState({
        name: false,
        email: false,
        password: false,
    });
    const [formErrors, setFormErrors] = useState({
        emailError: { isValid: true, message: "" },
        nameError: { isValid: true, message: "" },
        passwordError: { isValid: true, message: "" },
    });

    const onInputFocus = (inputName) => {
        const newState = {};
        newState[inputName] = true;
        setDirtyInputs((ps) => ({ ...ps, ...newState }));
        setOnFocusInput((ps) => ({ ...ps, ...newState }));
    };

    const onInputBlur = (inputName) => {
        const newState = {};
        newState[inputName] = false;
        setOnFocusInput((ps) => ({ ...ps, ...newState }));
    };

    useEffect(() => {
        const { email, name, password } = firstStepValues;
        const { isValidEmail, isValidName, isValidPassword } = formValidation({
            name,
            email,
            password,
            onFocusInput,
            dirtyInputs,
        });
        const { emailError, nameError, passwordError } = getFormErrors({
            validations: { isValidEmail, isValidName, isValidPassword },
            values: { password, email },
        });
        setFormErrors((fe) => ({
            ...fe,
            emailError,
            nameError,
            passwordError,
        }));
    }, [firstStepValues, onFocusInput, dirtyInputs]);

    const handleSecondFormSubmit = async () => {
        const { aboutme, type, address } = secondStepValues;
        const { name, password, email } = firstStepValues;
        const requestData = {
            name,
            password,
            email,
            about_me: aboutme,
            type,
            address,
        };
        try {
            const response = await registerUser(requestData);
            const success = response.status === "OK";
            if (success) {
                setSecondStepSucess(true);
                dispatch(closeModal());
            }
        } catch (err) {
            toast.error("מצטערים, התהליך לא הצליח. נא לנסות שוב", {
                position: "bottom-center",
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleFirstFormSubmit = async () => {
        const { email, name, password } = firstStepValues;
        const {
            isValidEmail,
            isValidName,
            isValidPassword,
        } = firstStepValidation({
            name,
            email,
            password,
            onFocusInput,
            dirtyInputs,
        });
        if (!isValidEmail || !isValidName || !isValidPassword) {
            const { emailError, nameError, passwordError } = getFormErrors({
                validations: { isValidEmail, isValidName, isValidPassword },
                values: { email, name, password },
            });
            setFormErrors({
                ...formErrors,
                emailError,
                nameError,
                passwordError,
            });

            return;
        }
        try {
            const response = await authenticateEmail(email);
            const {
                status,
                data: { isUserRegistered },
            } = response;
            const successResponse = status === "OK" && !isUserRegistered;
            if (successResponse) {
                setFirstStepSucess(true);
            } else if (isUserRegistered) {
                const emailError = {
                    isValid: false,
                    message: "המייל קיים במערכת",
                };
                setFormErrors({ ...formErrors, emailError });
            }
        } catch (err) {
            if (err.message === "Error: Request failed with status code 400") {
                const emailError = { isValid: false, message: "המייל לא תקין" };
                setFormErrors({ ...formErrors, emailError });
            }
        }
    };

    return firstStepSuccess && secondStepSuccess ? (
        <Redirect
            to={{
                pathname: EMAIL_SENT_PAGE,
                state: { email: firstStepValues.email },
            }}
        />
    ) : firstStepSuccess ? (
        <SecondStepSignup
            errors={formErrors}
            values={secondStepValues}
            setValues={setSecondStepValues}
            handleSubmit={handleSecondFormSubmit}
        />
    ) : (
        <FirstStepSignup
            errors={formErrors}
            inputFocus={onInputFocus}
            inputBlur={onInputBlur}
            values={firstStepValues}
            setValues={setFirstStepValues}
            handleSubmit={handleFirstFormSubmit}
        />
    );
};

export default SignupForms;
