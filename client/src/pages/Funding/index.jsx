import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { externalPaymentErrorToast } from 'toasts'
import YoutubeVideo from 'react-youtube'
import { Button, Checkbox, TextInput, Divider, HelperText } from '../../shared';
import { openModal, closeModal } from 'redux/modal/slice'
import { useDispatch } from 'react-redux'
import { createPaymentLink, registerUser } from './controller';
import { paymentRequestValidation, getFormErrors, formValidation } from './validations'
import { titles, paymentAmountOptions, roadmap } from './constants'
import * as SC from './style';
import Wrapper from '../../components/Wrapper';
import Icon from '../../assets/svg/successIcon'

const FundingPage = () => {

	const dispatch = useDispatch();
	const [paymentRequestReady, setPaymentRequestReady] = useState(false);
	const [otherAmount, setOtherAmount] = useState(0);
	const [amount, setAmount] = useState();
	const [termsAccepted, setTermsAccepted] = useState(false );
	const [paymentUrl, setPaymentUrl] = useState();
	const [onFocusInput, setOnFocusInput] = useState({ name: false, password: false, email: false })
	const [dirtyInputs, setDirtyInputs] = useState({ name: false, email: false, password: false })
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

	const validateFormInput = () => {
		const { isValidAmount, isValidAcceptedTerms} = paymentRequestValidation({ amount, termsAccepted })
		const { amountError, termsAcceptedError } =
			getFormErrors({
				validations: { isValidAmount, isValidAcceptedTerms },
				values: { amount, termsAccepted }
			})
		setFormErrors({ ...formErrors, amountError, termsAcceptedError })

		return { isValidAmount, isValidAcceptedTerms}
	}

	useEffect(() => {
		validateFormInput()
	}, [ amount, termsAccepted ])

	const handlePaymentRequest = async () => {
		const { isValidAmount, isValidAcceptedTerms } = validateFormInput()
		if (!isValidAmount || !isValidAcceptedTerms) return;

		try {
			const paymentpageUrl = await createPaymentLink({amount})
			setPaymentUrl(paymentpageUrl)
			dispatch(openModal({ modalType: 'payment', modalProps: { url: paymentpageUrl } }))

		} catch (err) {
			// error from the paymnet service, or other errors, need to check
			externalPaymentErrorToast()
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
								<SC.RoadmapItemTitle> {i.title} </SC.RoadmapItemTitle>
								<SC.RoadmapItemDescription> {i.desciption} </SC.RoadmapItemDescription>
							</SC.RoadmapItemWrapper>))}
					</SC.RoadmapDetails>
					<Divider/>
					<SC.PaymentWrapper>
							<SC.PaymentOptions>
							{paymentAmountOptions.map(o => (
								<div>
									<SC.PaymentOption onClick={ () => { setAmount(o) } }>
										<SC.Amount>{o} ₪</SC.Amount>
										<br/>
										<SC.Monthly>בחודש</SC.Monthly>
									 </SC.PaymentOption>
								</div>
							))}
								<div>
									<SC.PaymentOption onClick={ () => { setAmount(otherAmount) } } > סכום אחר
										<TextInput type="number" width="3.5em" min="1" max="20000" onChange={ ({ target: { value } }) => {
											setOtherAmount(Number.parseInt(value));
											setAmount(value)}}
										/> <br/>
									</SC.PaymentOption>
								</div>
								<HelperText error={formErrors.amountError.message} />
							</SC.PaymentOptions>
							<SC.TermsOfUseWrapper>
							אני מאשר/ת את תנאי התמיכה
								<Checkbox error={formErrors.termsAcceptedError.message} onClick={ () => { setTermsAccepted(!termsAccepted) } }>  </Checkbox>
							</SC.TermsOfUseWrapper>
							<SC.ButtonWrapper>
								<Button id="payment-button" text="תמכו במעירים" onClick={ handlePaymentRequest } style={'width:'}/>
							</SC.ButtonWrapper>
					</SC.PaymentWrapper>
					</SC.InputsWrapper>
			</SC.MainWrapper>
		</Wrapper>
			);
};

export default FundingPage;
