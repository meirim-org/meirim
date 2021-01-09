import React, { useEffect, useState } from 'react';
import { externalPaymentErrorToast } from 'toasts'
import YoutubeVideo from 'react-youtube'
import { Button, Checkbox, TextInput, Divider, HelperText, Link, TabPanel, TabBox } from '../../shared';
import { openModal, closeModal } from 'redux/modal/slice'
import { useDispatch } from 'react-redux'
import { createPaymentLink } from './controller';
import { paymentRequestValidation, getFormErrors } from './validations'
import { titles, paymentAmountOptions, roadmap } from './constants'
import * as SC from './style';
import Wrapper from '../../components/Wrapper';
import DefaultIcon from '../../assets/svg/successIcon';
import * as Icons from '../../assets/funding';

const FundingPage = () => {

	const dispatch = useDispatch();
	const [paymentRequestReady, setPaymentRequestReady] = useState(false);
	const [otherAmount, setOtherAmount] = useState(0);
	const [amount, setAmount] = useState();
	const [termsAccepted, setTermsAccepted] = useState(false );
	const [triedSubmit, setTriedSubmit] = useState(false );
	const [paymentUrl, setPaymentUrl] = useState();
	const [onFocusInput, setOnFocusInput] = useState({ name: false, password: false, email: false })
	const [dirtyInputs, setDirtyInputs] = useState({ name: false, email: false, password: false })
	const [formErrors, setFormErrors] = useState({
		amountError:{ isValid: true, message:'' },
		termsAcceptedError:{ isValid: true, message:'' },
	})

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
		setTriedSubmit(true);
		const { isValidAmount, isValidAcceptedTerms } = validateFormInput()
		if (!isValidAmount || !isValidAcceptedTerms) return;

		try {
			const paymentpageUrl = await createPaymentLink({amount})
			setPaymentUrl(paymentpageUrl)
			dispatch(openModal({ modalType: 'payment', modalProps: { url: paymentpageUrl } }))

		} catch (err) {
			// error from the paymnet service, or other errors, need to check
			externalPaymentErrorToast()
			// if(err.message === 'Error: Request failed with status code 400'){
			// 	const emailError = { isValid: false, message: 'המייל לא תקין' }
			// 	// setFormErrors({ ...formErrors, emailError })
			// }
		}
	};

	useEffect(() => {
		const handler = event => {
		  const data = JSON.parse(event.data)

		  // closing the modal, as the success page alerted user pressed close
		  dispatch(closeModal())
		}
		window.addEventListener("message", handler)
	})
	const renderIcon = (iconName)=>{
		let Gal = Icons[iconName] || DefaultIcon
		return (Icons[iconName] || DefaultIcon)()
	}
	return (
		<Wrapper>
		<SC.MainWrapper>
				<SC.HeaderWrapper>
					<SC.Titles>
						<SC.SubTitleWrapper>
							<SC.ThirdTitle>{titles.subTitle}</SC.ThirdTitle>
							<SC.SubTitle>{titles.third}</SC.SubTitle>
							<SC.SubTitle style={{'color':'#391695'}}>{titles.fourth} </SC.SubTitle>
							<SC.SubTitle>{titles.fifth} </SC.SubTitle>
						</SC.SubTitleWrapper>
					</SC.Titles>
					<SC.MediaContent>
						<YoutubeVideo url="https://www.youtube.com/watch?v=Bd_RD9rHrbQ"/>
					</SC.MediaContent>
				</SC.HeaderWrapper>
				<SC.InputsWrapper>
					<TabPanel>
					<SC.RoadmapDetails>
						<SC.RoadMapTitle>מה בתוכנית? </SC.RoadMapTitle>
						{roadmap.map(i => (
							<SC.RoadmapItemWrapper>
								<SC.RoadmapItemIcon>
									{(Icons[i.fundingSVGName] || DefaultIcon)()}
								</SC.RoadmapItemIcon>
								<SC.RoadmapItemTitle> {i.title} </SC.RoadmapItemTitle>
								<SC.RoadmapItemDescription> {i.desciption} </SC.RoadmapItemDescription>
							</SC.RoadmapItemWrapper>))}
					</SC.RoadmapDetails>
					</TabPanel>
					<Divider/>
					
					<SC.PaymentWrapper>
					<SC.FundUsTitle>עזרו לנו להמשיך! </SC.FundUsTitle>
							{/* <SC.PaymentOptions> */}
							<TabPanel style={{'width':'460px'}}>
						<TabBox>
							 {paymentAmountOptions.map(o => (
								<div>
									<SC.PaymentOption className={amount===o?'active':''} onClick={ () => { setAmount(o) } }>
										<SC.Amount>{o} ₪</SC.Amount>
									 </SC.PaymentOption>
								</div>
							))}
								<div>
									<SC.PaymentOption className={'longer'} onClick={ () => { setAmount(otherAmount) } } > סכום אחר
										<TextInput type="number" width="3.5em" min="1" max="20000" onChange={ ({ target: { value } }) => {
											setOtherAmount(Number.parseInt(value));
											setAmount(value)}}
										/>
									</SC.PaymentOption>
								</div>
								<HelperText error={triedSubmit?formErrors.amountError.message:''} />
								
							{/* </SC.PaymsentOptions> */}
							<SC.TermsOfUseWrapper>
							<span>אני מאשר/ת את </span>  
								 <Link id="funding-temrs-of-payment-link" text="תנאי התמיכה " onClick={ () => { dispatch(openModal({ modalType: 'termsOfPayment' }))}}/>
								<Checkbox error={triedSubmit?formErrors.termsAcceptedError.message:''} onClick={ () => { setTermsAccepted(!termsAccepted) } }>  </Checkbox>
							</SC.TermsOfUseWrapper>
							{/* </TabBox>
							</TabPanel> */}
							<SC.ButtonWrapper>
								<Button id="payment-button" text="תמכו במעירים" onClick={ handlePaymentRequest } style={'width:'}/>
							</SC.ButtonWrapper>
							</TabBox>
							</TabPanel>
					</SC.PaymentWrapper>
					</SC.InputsWrapper>
			</SC.MainWrapper>
		</Wrapper>
			);
};

export default FundingPage;
