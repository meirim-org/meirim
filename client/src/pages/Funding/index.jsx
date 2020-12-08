import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import YoutubeVideo from 'react-youtube'
import { Button, Checkbox, TextInput, Divider } from '../../shared';
import { openModal, closeModal } from 'redux/modal/slice'
import { useDispatch } from 'react-redux'
import { createPaymentLink, registerUser } from './controller';
import Payment from './payment';
import SecondStepSignup from './secondStep';
import { EMAIL_SENT_PAGE } from '../../router/contants'
import { firstStepValidation, formValidation, getFormErrors } from './validations'
import { titles, paymentAmountOptions,  roadmap } from './constants'
import * as SC from './style';
import Wrapper from '../../components/Wrapper';
import Icon from '../../assets/svg/successIcon'

const FundingPage = () => {

	const dispatch = useDispatch();
	const [firstStepSuccess, setFirstStepSucess] = useState(false);
	const [paymentRequestReady, setPaymentRequestReady] = useState(false);
	const [otherAmount, setOtherAmount] = useState(0);
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

		try {
			const paymentpageUrl= await createPaymentLink(paymentOption)
			console.log(paymentpageUrl)
			setPaymentUrl(paymentpageUrl)
			// setPaymentRequestReady(true)
			dispatch(openModal({ modalType: 'payment', modalProps:{url:paymentpageUrl} }))
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

	return (
		<Wrapper>
		<SC.MainWrapper>
				<SC.HeaderWrapper>
					<SC.Titles>
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
					<SC.RoadmapDetails>
						<SC.RoadMapTitle>מה בתוכנית? </SC.RoadMapTitle>
						{roadmap.map(i => (
							<SC.RoadmapItemWrapper>
								<SC.RoadmapItemIcon><Icon/></SC.RoadmapItemIcon>
								<SC.RoadmapItemTitle>
									{i.title}
								</SC.RoadmapItemTitle>
								<SC.RoadmapItemDescription>
									{i.desciption}
								</SC.RoadmapItemDescription>
							</SC.RoadmapItemWrapper>))}
					</SC.RoadmapDetails>
					<Divider></Divider>
					<SC.PaymentWrapper>
							<SC.PaymentOptions>
							{paymentAmountOptions.map(o => (
								<div>
									<SC.PaymentOption onClick={()=>{setPaymentOption({amount:o})}}>
									<SC.Amount>{o} ₪</SC.Amount>
									 <br/>
									 <SC.Monthly>בחודש</SC.Monthly>
									 </SC.PaymentOption>
								</div>
							))}
								<div>
									<SC.PaymentOption onClick={()=>{setPaymentOption({ amount: otherAmount})}}> סכום אחר
										<TextInput type="number" width="3.5em" onChange={({ target: { value } }) => {
											setOtherAmount(Number.parseInt(value));
											setPaymentOption({ amount: value})}}
										/> <br/>
									</SC.PaymentOption>
								</div>
							</SC.PaymentOptions>
							<SC.TermsOfUseWrapper><Checkbox> </Checkbox>אני מאשר/ת את תנאי התמיכה</SC.TermsOfUseWrapper>
							<Button id="payment-button" text="תמכו במעירים" onClick={handlePaymentRequest} />
					</SC.PaymentWrapper>
					</SC.InputsWrapper>
			</SC.MainWrapper>
		</Wrapper>
			);
};

export default FundingPage;
