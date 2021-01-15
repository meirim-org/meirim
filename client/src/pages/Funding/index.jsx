import React, { useEffect, useState } from 'react';
import { externalPaymentErrorToast } from 'toasts';
import YoutubeVideo from 'react-youtube';
import { Button, Checkbox, TextInput, Divider, HelperText, Link, TabPanel, TabBox, ProgressBar, Typography, TeamMembers } from '../../shared';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/styles';
import { createPaymentLink } from './controller';
import { paymentRequestValidation, getFormErrors } from './validations';
import { titles, paymentAmountOptions, roadmap, fundingEndGoal, fundingYoutubeVideoId } from './constants';
import * as SC from './style';
import Wrapper from '../../components/Wrapper';
import DefaultIcon from '../../assets/svg/successIcon';
import * as Icons from '../../assets/funding';
import { useStatsDataHandler, useSuccessCloseHandler } from './hooks';
import { FundingSelectors } from 'redux/selectors';
import t from 'locale/he_IL';

const FundingPage = () => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const [paymentRequestReady, setPaymentRequestReady] = useState(false);
	const [otherAmount, setOtherAmount] = useState(0);
	const [amount, setAmount] = useState();
	const [termsAccepted, setTermsAccepted] = useState(false );
	const [triedSubmit, setTriedSubmit] = useState(false );
	const [paymentDone, setPaymentDone] = useState(0);
	const [paymentUrl, setPaymentUrl] = useState();
	const [onFocusInput, setOnFocusInput] = useState({ name: false, password: false, email: false })
	const [dirtyInputs, setDirtyInputs] = useState({ name: false, email: false, password: false })
	const [formErrors, setFormErrors] = useState({
		amountError:{ isValid: true, message:'' },
		termsAcceptedError:{ isValid: true, message:'' },
	});
	const [monthlyPayment, setMonthlyPayment] = useState(true);

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
			const paymentpageUrl = await createPaymentLink({amount, monthlyPayment});
			setPaymentUrl(paymentpageUrl);
			dispatch(openModal({ modalType: 'payment', modalProps: { url: paymentpageUrl } }));
		} catch (err) {
			// error from the paymnet service, or other errors, need to check
			externalPaymentErrorToast()
			// if(err.message === 'Error: Request failed with status code 400'){
			// 	const emailError = { isValid: false, message: 'המייל לא תקין' }
			// 	// setFormErrors({ ...formErrors, emailError })
			// }
		}
	};

	useStatsDataHandler(paymentDone);

	function paymentSuccess() {
		setAmount(0);
		setOtherAmount(0);
		setTermsAccepted(false);
		setTriedSubmit(false);
		setPaymentDone(paymentDone + 1);
	}
	useSuccessCloseHandler(paymentSuccess);

	const { statsData } = FundingSelectors();

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
						<YoutubeVideo opts={{width: '100%'}} videoId={fundingYoutubeVideoId}/>
					</SC.MediaContent>
				</SC.HeaderWrapper>
				<SC.InputsWrapper>
					<SC.RoadMapWrapper>
						<TabPanel>
							<SC.RoadmapDetails>
								<SC.RoadMapTitleWrapper>
									<Divider orientation="horizontal" style={{'flex-grow': 1, 'height': '1px', 'margin-top': '-25px'}}/>
									<SC.RoadMapTitle>מה בתוכנית? </SC.RoadMapTitle>
									<Divider orientation="horizontal" style={{'flex-grow': 1, 'height': '1px', 'margin-top': '-25px'}}/>
								</SC.RoadMapTitleWrapper>
								{roadmap.map(i => (
									<SC.RoadmapItemWrapper key={i.id}>
										<SC.RoadmapItemIcon>
											{(Icons[i.fundingSVGName] || DefaultIcon)()}
										</SC.RoadmapItemIcon>
										<SC.RoadmapItemTitle> {i.title} </SC.RoadmapItemTitle>
										<SC.RoadmapItemDescription> {i.desciption} </SC.RoadmapItemDescription>
									</SC.RoadmapItemWrapper>
								))}
							</SC.RoadmapDetails>
						</TabPanel>
					</SC.RoadMapWrapper>
					<Divider orientation="vertical"/>
					<SC.PaymentWrapper>
						<SC.FundUsTitle>הצטרפו למהפכה </SC.FundUsTitle>
						<TabPanel>
							<SC.FundingStatsWrapper>
								<SC.CentredSubTitle>{t.fundingStatsTitle}</SC.CentredSubTitle>
								<div>
									<ProgressBar id="funding-stats-progressbar" value={statsData.totalAmount / fundingEndGoal * 100} width="100%"/>
								</div>
								<SC.FundingStatsNumbersWrapper>
									<SC.FundingStatsNumberWrapper>
										<SC.SubTitle>{statsData.totalAmount.toLocaleString('en')} {t.fundingShekel}</SC.SubTitle>
										<Typography
											component="span"
											variant="title"
											mobileVariant="highlightedText"
											color={theme.palette.primary['main']}
										>
											{t.fundingOutOf} {fundingEndGoal.toLocaleString('en')} {t.fundingShekel}
										</Typography>
									</SC.FundingStatsNumberWrapper>
									<SC.FundingStatsNumberWrapper>
										<SC.SubTitle>{statsData.count.toLocaleString('en')}</SC.SubTitle>
										<Typography
											component="span"
											variant="title"
											mobileVariant="highlightedText"
											color={theme.palette.primary['main']}
										>
											{t.fundingSupporters}
										</Typography>
									</SC.FundingStatsNumberWrapper>
								</SC.FundingStatsNumbersWrapper>
							</SC.FundingStatsWrapper>
							<SC.PaymentTypeButtonsWrapper>
								<SC.PaymentTypeButton side="right" selected={monthlyPayment} onClick={() => { setMonthlyPayment(true); }}>
									<Typography component="span" variant="planTitle" mobileVariant="planTitle">
										{t.monthlyPayment}
									</Typography>
								</SC.PaymentTypeButton>
								<SC.PaymentTypeButton side="left" selected={!monthlyPayment} onClick={() => { setMonthlyPayment(false); }}>
									<Typography component="span" variant="planTitle" mobileVariant="planTitle">
										{t.singleTimePayment}
									</Typography>
								</SC.PaymentTypeButton>
							</SC.PaymentTypeButtonsWrapper>
							<SC.PaymentOptionsWrapper>
								{paymentAmountOptions.map(o => (
									<SC.PaymentOption className={amount===o?'active':''} onClick={ () => { setAmount(o) } }>
										<SC.Amount>{o} {t.fundingShekel}</SC.Amount>
									</SC.PaymentOption>
								))}
								<SC.PaymentOption className={'longer'} onClick={ () => { setAmount(otherAmount) } } >
									<SC.PaymentOtherOption>
									<SC.Amount>סכום אחר</SC.Amount>
									<TextInput
										id="other-amount-input"
										name="other-amount"
										type="number"
										width="3.5em"
										min={1}
										max={20000}
										value={otherAmount.toString()}
										onChange={({ target: { value } }) => {
											setOtherAmount(Number.parseInt(value));
											setAmount(value)}
										}
									/>
									</SC.PaymentOtherOption>
								</SC.PaymentOption>
								<HelperText id="amount-error-helper-text" text="" error={triedSubmit ? formErrors.amountError.message : ''} />
							</SC.PaymentOptionsWrapper>
							<SC.TermsOfUseWrapper>
								<Checkbox id="terms-accepted-checkbox" text="" checked={termsAccepted} error={triedSubmit ? formErrors.termsAcceptedError.message : ''} onClick={() => { setTermsAccepted(!termsAccepted) }}/>
								<span>אני מאשר/ת את&nbsp;</span>
								<Link
									id="funding-terms-of-payment-link"
									text="תנאי התמיכה "
									fontWeight="600"
									textDecoration="none"
									url="#"
									onClick={ () => { dispatch(openModal({ modalType: 'termsOfPayment' }))}}
								/>
							</SC.TermsOfUseWrapper>
							<SC.ButtonWrapper>
								<Button id="payment-button" text="תמכו במעירים" onClick={ handlePaymentRequest }/>
							</SC.ButtonWrapper>
						</TabPanel>
					</SC.PaymentWrapper>
				</SC.InputsWrapper>
				<Divider orientation="horizontal" style={{'flex-grow': 1, 'height': '4px', 'margin-top': '-25px'}}/>
				<h1>מי אנחנו</h1>
				<TeamMembers></TeamMembers>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default FundingPage;
