import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import YoutubeVideo from 'react-youtube'
import { Button, Checkbox, Modal, TextInput } from '../../shared';
import { createPaymentLink, registerUser } from './controller';
import Payment from './payment';
import SecondStepSignup from './secondStep';
import { EMAIL_SENT_PAGE } from '../../router/contants'
import { firstStepValidation, formValidation, getFormErrors } from './validations'
import { titles, paymentAmountOptions } from './constants'
import * as SC from './style';
import Wrapper from '../../components/Wrapper';

const FundingPage = () => {
	const [firstStepSuccess, setFirstStepSucess] = useState(false);
	const [paymentRequestReady, setPaymentRequestReady] = useState(false);
	const [secondStepSuccess, setSecondStepSucess] = useState(false);
	const [firstStepValues, setFirstStepValues] = useState({ name: '', password: '', email: '' });
	const [paymentOption, setPaymentOption] = useState({ amount: '' });
	const [paymentUrl, setPaymentUrl] = useState();
	const [secondStepValues, setSecondStepValues] = useState({ type: 1, aboutme: '', address: '' });
	const [onFocusInput, setOnFocusInput] = useState({ name: false, password: false, email: false })
	const [dirtyInputs, setDirtyInputs] = useState({ name: false, email: false, password: false })
	const [loginValues, setLoginValues] = useState({ email: '', password: '' });
	const [formErrors, setFormErrors] = useState({
		emailError:{ isValid: true, message:'' },
		nameError:{ isValid: true, message:'' },
		passwordError:{ isValid: true, message:'' }
	})

	const onInputFocus = (inputName) => {
		const newState = {}
		newState[inputName] = true
		setDirtyInputs(ps => ({ ...ps, ...newState }))
		setOnFocusInput(ps => ({ ...ps, ...newState }))
	}

	const onInputBlur = (inputName) => {
		const newState = {}
		newState[inputName] = false
		setOnFocusInput(ps => ({ ...ps, ...newState }))
	}

	useEffect(() => {
		const { email , name, password } = firstStepValues
		const { isValidEmail, isValidName, isValidPassword } = formValidation({ name ,email, password, onFocusInput, dirtyInputs })
		const { emailError, nameError, passwordError } = 
			getFormErrors({ 
				validations: { isValidEmail, isValidName, isValidPassword }, 
				values: { password, email } 
			})
		setFormErrors(fe => ({ ...fe, emailError, nameError, passwordError }))
	}, [firstStepValues, onFocusInput, dirtyInputs])

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
			const response = await registerUser(requestData)
			const success = response.status === 'OK'
			if (success) {
				setSecondStepSucess(true);
			}
		} catch (err) {
			toast.error('מצטערים, התהליך לא הצליח. נא לנסות שוב', {
				position: 'bottom-center',
				autoClose: false,
				hideProgressBar: true,
				closeOnClick: true,
				draggable: true,
			})
		}
	};

	const handleFirstFormSubmit = async () => {
		const { email , name, password } = firstStepValues
		const { isValidEmail, isValidName, isValidPassword } = 
			firstStepValidation({ name ,email, password, onFocusInput, dirtyInputs })
		if(!isValidEmail || !isValidName || !isValidPassword){
			const { emailError, nameError, passwordError } = 
				getFormErrors({ 
					validations: { isValidEmail, isValidName, isValidPassword }, 
					values: { email, name, password } 
				})
			setFormErrors({ ...formErrors, emailError, nameError, passwordError })
	
			return
		}
		try {
			const response = await createPaymentLink();
			const { status, data: { isUserRegistered } } = response
			const successResponse = status === 'OK' && !isUserRegistered
			if (successResponse) {
				setPaymentRequestReady(true);
			} else if (isUserRegistered) {
				const emailError = { isValid: false, message: 'המייל קיים במערכת' }
				setFormErrors({ ...formErrors, emailError })
			}
		} catch (err) {
			if(err.message === 'Error: Request failed with status code 400'){
				const emailError = { isValid: false, message: 'המייל לא תקין' }
				setFormErrors({ ...formErrors, emailError })
			}
		}
	};

	const handlePaymentRequest = async () => {
		
		 const { email , name, password } = firstStepValues
		// const { isValidEmail, isValidName, isValidPassword } = 
		// 	firstStepValidation({ name ,email, password, onFocusInput, dirtyInputs })
		// if(!isValidEmail || !isValidName || !isValidPassword){
		// 	const { emailError, nameError, passwordError } = 
		// 		getFormErrors({ 
		// 			validations: { isValidEmail, isValidName, isValidPassword }, 
		// 			values: { email, name, password } 
		// 		})
		// 	setFormErrors({ ...formErrors, emailError, nameError, passwordError })
	
		// 	return
		// }
		try {
			//const response = await authenticateEmail(email);
			const paymentpageUrl= await createPaymentLink(paymentOption)
			//console.log(paymentpageUrl)
			setPaymentUrl(paymentpageUrl)
			setPaymentRequestReady(true)
			// const { status, data: { isUserRegistered } } = response
			// const successResponse = status === 'OK' && !isUserRegistered
			// if (successResponse) {
			// 	setFirstStepSucess(true);
			// } else if (isUserRegistered) {
			// 	const emailError = { isValid: false, message: 'המייל קיים במערכת' }
			// 	setFormErrors({ ...formErrors, emailError })
			// }
		} catch (err) {
			if(err.message === 'Error: Request failed with status code 400'){
				const emailError = { isValid: false, message: 'המייל לא תקין' }
				setFormErrors({ ...formErrors, emailError })
			}
		}
	};

	const paymentFormClose = () => {
		window.alert('modal was closed')
	}

	return (
		// <div onClick={handlePaymentRequest}>Hey
		// 	{/* */
		// </div>
		<SC.MainWrapper>
				<SC.HeaderWrapper>
			{/* <Payment url="https://icom.yaad.net/p3/?action=pay&Amount=500&Coin=1&Info=%D7%AA%D7%A8%D7%95%D7%9E%D7%94%20%D7%97%D7%93%20%D7%A4%D7%A2%D7%9E%D7%99%D7%AA%20%D7%9C%D7%A2%D7%9E%D7%95%D7%AA%D7%AA%20%D7%9E%D7%A2%D7%99%D7%A8%D7%99%D7%9D&Masof=0010157216&PageLang=HEB&Pritim=True&SendHesh=True&UTF8=True&UTF8out=True&action=pay&heshDesc=~%D7%AA%D7%A8%D7%95%D7%9E%D7%94%2520%D7%97%D7%93%2520%D7%A4%D7%A2%D7%9E%D7%99%D7%AA%2520%D7%9C%D7%A2%D7%9E%D7%95%D7%AA%D7%AA%2520%D7%9E%D7%A2%D7%99%D7%A8%D7%99%D7%9D~1~500&sendemail=True&tmp=9&signature=a451d7fcff0b31b7b35e1c4d369fd347897e26217b37f6d8fd29836d4a53336b" display={paymentRequestReady} values={{b:1}}/> */}
			<Payment url={paymentUrl} display={paymentRequestReady} values={{b:1}}/>
					<SC.Titles>
						<SC.Title>תמכו בנו</SC.Title>
						<SC.SubTitleWrapper>
							<SC.SubTitle>{titles.subTitle}</SC.SubTitle>
							<SC.ThirdTitle>{titles.third}</SC.ThirdTitle>
							<SC.SubTitle>{titles.fourth} </SC.SubTitle>
							{/* <SC.SubTitle>
								<span>עוד לא הצטרפתם? </span>
								<Link id="login-signin-link" text="הרשמו עכשיו" to="/sign/up" bold={'700'} />
							</SC.SubTitle> */}
						</SC.SubTitleWrapper>
					</SC.Titles>
					<SC.MediaContent>
						<YoutubeVideo url="https://www.youtube.com/watch?v=Bd_RD9rHrbQ"/>
					</SC.MediaContent>
				</SC.HeaderWrapper>
				<SC.InputsWrapper>
					<SC.RoadmapDetails>מה בתוכנית? </SC.RoadmapDetails>
					<SC.PaymentOptions>
							<SC.PaymentOptionsWrapper>
							{paymentAmountOptions.map(o => (
								<div>
									<SC.PaymentOption onClick={()=>{setPaymentOption({amount:o})}}> {o} ₪ <br/> בחודש</SC.PaymentOption>
								</div>
							))}
								<div>
									<SC.PaymentOption onClick={()=>{setPaymentOption({amount:4})}}> סכום אחר <TextInput></TextInput> <br/> בחודש</SC.PaymentOption>
								</div>
							</SC.PaymentOptionsWrapper>
							<SC.TermsOfUseWrapper>אני מאשר <Checkbox> שלום ךכם</Checkbox></SC.TermsOfUseWrapper>
							<Button id="login-button" text="תמכו בנו" onClick={handlePaymentRequest} />
					</SC.PaymentOptions>
				</SC.InputsWrapper>
				{/* <SC.ButtonWrapper>
					<Button id="login-button" text="התחברות למעירים" onClick={handleFirstFormSubmit} />
				</SC.ButtonWrapper> */}
			</SC.MainWrapper>
			);
};

export default FundingPage;
