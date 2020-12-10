import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import YoutubeVideo from 'react-youtube'
import { Button, Checkbox, TextInput, Divider, HelperText } from '../../shared';
import { openModal, closeModal } from 'redux/modal/slice'
import { useDispatch } from 'react-redux'
import { createPaymentLink, registerUser } from './controller';
import Payment from './payment';
import SecondStepSignup from './secondStep';
import { EMAIL_SENT_PAGE } from '../../router/contants'
import { paymentRequestValidation, getFormErrors, formValidation } from './validations'
import { titles, paymentAmountOptions,  roadmap } from './constants'
import * as SC from './style';
import Wrapper from '../../components/Wrapper';
import Icon from '../../assets/svg/successIcon'
import { faWindowMinimize } from '@fortawesome/free-solid-svg-icons';

const FundingPage = () => {

	const dispatch = useDispatch();
	const [firstStepSuccess, setFirstStepSucess] = useState(false);
	const [paymentRequestReady, setPaymentRequestReady] = useState(false);
	const [otherAmount, setOtherAmount] = useState(0);
	const [secondStepSuccess, setSecondStepSucess] = useState(false);
	const [firstStepValues, setFirstStepValues] = useState({ name: '', password: '', email: '' });
	const [paymentOption, setPaymentOption] = useState({ amount: '' });
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [paymentUrl, setPaymentUrl] = useState();
	const [onFocusInput, setOnFocusInput] = useState({ name: false, password: false, email: false })
	const [dirtyInputs, setDirtyInputs] = useState({ name: false, email: false, password: false })
	const [loginValues, setLoginValues] = useState({ email: '', password: '' });
	const [formErrors, setFormErrors] = useState({
		amountError:{ isValid: true, message:'' },
		termsAcceptedError:{ isValid: true, message:'' },
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

	// useEffect(() => {
	// 	const { email , name, password } = firstStepValues
	// //	const { isValidEmail, isValidName, isValidPassword } = formValidation({ name ,email, password, onFocusInput, dirtyInputs })
	// 	const { emailError, nameError, passwordError } =
	// 		getFormErrors({
	// 			validations: { isValidEmail, isValidName, isValidPassword },
	// 			values: { password, email }
	// 		})
	// 	setFormErrors(fe => ({ ...fe, emailError, nameError, passwordError }))
	// }, [firstStepValues, onFocusInput, dirtyInputs])

	const handlePaymentRequest = async () => {
		const {isValidAmount, isValidAcceptedTerms} = paymentRequestValidation({ amount: paymentOption.amount, termsAccepted })
		if(!isValidAmount || !isValidAcceptedTerms){
			const { amountError, termsAcceptedError } =
				getFormErrors({
					validations: { isValidAmount, isValidAcceptedTerms },
					values: { amount: paymentOption, termsAccepted }
				})
			setFormErrors({ ...formErrors, amountError, termsAcceptedError })

			return
		}

		try {
			const paymentpageUrl = await createPaymentLink(paymentOption)
			setPaymentUrl(paymentpageUrl)
			dispatch(openModal({ modalType: 'payment', modalProps: { url: paymentpageUrl } }))

			// const { status, data: { isUserRegistered } } = response
			// const successResponse = status === 'OK' && !isUserRegistered
			// if (successResponse) {
			// 	setFirstStepSucess(true);
			// } else if (isUserRegistered) {
			// 	const emailError = { isValid: false, message: 'המייל קיים במערכת' }
			// 	setFormErrors({ ...formErrors, emailError })
			// }
		} catch (err) {
			// all the errors from the payment 
			if(err.message === 'Error: Request failed with status code 400'){
				const emailError = { isValid: false, message: 'המייל לא תקין' }
				// setFormErrors({ ...formErrors, emailError })
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
								<HelperText error={formErrors.amountError.message} />
							</SC.PaymentOptions>
							<SC.TermsOfUseWrapper>
							אני מאשר/ת את תנאי התמיכה
								<Checkbox error={formErrors.termsAcceptedError.message} onClick={()=>{setTermsAccepted(!termsAccepted)}}>  </Checkbox></SC.TermsOfUseWrapper>
							<Button id="payment-button" text="תמכו במעירים" onClick={handlePaymentRequest} />
					</SC.PaymentWrapper>
					</SC.InputsWrapper>
			</SC.MainWrapper>
		</Wrapper>
			);
};

export default FundingPage;
