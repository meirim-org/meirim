import React, { useCallback, useRef, useState } from 'react';
import { externalPaymentErrorToast } from 'toasts';
import YoutubeVideo from 'react-youtube';
import { Button, Checkbox, Divider, HelperText, Link, TabPanel, ProgressBar, Typography, TeamMembers } from '../../shared';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/styles';
import { createPaymentLink } from './controller';
import { paymentRequestValidation, getFormErrors } from './validations';
import { paymentAmountOptions, roadmap, fundingEndGoal, fundingYoutubeVideoId } from './constants';
import * as SC from './style';
import Wrapper from '../../components/Wrapper';
import DefaultIcon from '../../assets/svg/successIcon';
import * as Icons from '../../assets/funding';
import AmountInput from './amountInput';
import { useStatsDataHandler, useSuccessCloseHandler, useWhoWeAreAnchor } from './hooks';
import { FundingSelectors } from 'redux/selectors';
import t from 'locale/he_IL';

const FundingPage = ({ ...props }) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const whoWeAreRef = useRef();

	const [otherAmount, setOtherAmount] = useState(0);
	const [amount, setAmount] = useState();
	const [termsAccepted, setTermsAccepted] = useState(false );
	const [triedSubmit, setTriedSubmit] = useState(false );
	const [paymentDone, setPaymentDone] = useState(0);
	const [formErrors, setFormErrors] = useState({
		amountError:{ isValid: true, message:'' },
		termsAcceptedError:{ isValid: true, message:'' },
	});
	const [monthlyPayment, setMonthlyPayment] = useState(true);

	const validateFormInput = useCallback(() => {
		const { isValidAmount, isValidAcceptedTerms} = paymentRequestValidation({ amount, termsAccepted });
		const { amountError, termsAcceptedError } = getFormErrors({
			validations: { isValidAmount, isValidAcceptedTerms },
			values: { amount, termsAccepted }
		});

		setFormErrors({ ...formErrors, amountError, termsAcceptedError });
		return { isValidAmount, isValidAcceptedTerms };
	}, [amount, termsAccepted, formErrors]);

	const handlePaymentRequest = async () => {
		setTriedSubmit(true);
		const { isValidAmount, isValidAcceptedTerms } = validateFormInput()
		if (!isValidAmount || !isValidAcceptedTerms) return;

		try {
			const paymentpageUrl = await createPaymentLink({amount, monthlyPayment});
			dispatch(openModal({ modalType: 'payment', modalProps: { url: paymentpageUrl } }));
		} catch (err) {
			externalPaymentErrorToast()
		}
	};

	useStatsDataHandler(paymentDone);

	function paymentSuccess() {
		setAmount(null);
		setOtherAmount(0);
		setTermsAccepted(false);
		setTriedSubmit(false);
		setPaymentDone(paymentDone + 1);
	}
	useSuccessCloseHandler(paymentSuccess);

	useWhoWeAreAnchor(props.location.hash, whoWeAreRef);

	const { statsData } = FundingSelectors();

	return (
		<Wrapper>
			<SC.MainWrapper>
				<SC.HeaderWrapper>
					<SC.Titles>
						<SC.SubTitleWrapper>
							<SC.MainTitle>{t.fundingMainTitle}</SC.MainTitle>
							<SC.SubTitle>{t.fundingSubTitle}</SC.SubTitle>
							<SC.SubTitle fontWeight="600">{t.fundingSubTitleBold}</SC.SubTitle>
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
								<SC.SectionTitleWithHorizontalDividersWrapper>
									<Divider orientation="horizontal"/>
									<SC.SectionTitle>מה בתוכנית? </SC.SectionTitle>
									<Divider orientation="horizontal"/>
								</SC.SectionTitleWithHorizontalDividersWrapper>
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
						<SC.SectionTitle>{t.fundingSectionTitle}</SC.SectionTitle>
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
									<Typography component="span" variant="planTitle" mobileVariant="cardTitle" color={theme.palette.primary['main']}>
										{t.monthlyPayment}
									</Typography>
								</SC.PaymentTypeButton>
								<SC.PaymentTypeButton side="left" selected={!monthlyPayment} onClick={() => { setMonthlyPayment(false); }}>
									<Typography component="span" variant="planTitle" mobileVariant="cardTitle" color={theme.palette.primary['main']}>
										{t.singleTimePayment}
									</Typography>
								</SC.PaymentTypeButton>
							</SC.PaymentTypeButtonsWrapper>
							<SC.PaymentOptionsWrapper>
								{paymentAmountOptions.map(o => (
									<SC.PaymentOption key={`amount-option-${o}`} className={amount===o?'active':''} onClick={ () => { setAmount(o) } }>
										<SC.Amount>{o} {t.fundingShekel}</SC.Amount>
									</SC.PaymentOption>
								))}
								<SC.PaymentOption className={amount===otherAmount?'active longer':'longer'} onClick={ () => { setAmount(otherAmount) } } >
									<SC.PaymentOtherOption>
										<SC.OtherAmountInput
											id="other-amount-input"
											name="other-amount"
											placeholder="סכום אחר"
											onChange={({ target: { value }}) => {
												setOtherAmount(Number.parseInt(value));
												setAmount(Number.parseInt(value));
											}}
											disableUnderline={true}
											inputComponent={AmountInput}
										/>
									</SC.PaymentOtherOption>
								</SC.PaymentOption>
								<HelperText id="amount-error-helper-text" text="" error={triedSubmit ? formErrors.amountError.message : ''}/>
							</SC.PaymentOptionsWrapper>
							<SC.TermsOfUseWrapper>
								<SC.TermsOfUseCheckboxWrapper>
									<Checkbox
										id="terms-accepted-checkbox"
										text=""
										checked={termsAccepted}
										onClick={() => { setTermsAccepted(!termsAccepted) }}
									/>
									<span>אני מאשר/ת את&nbsp;</span>
									<Link
										id="funding-terms-of-payment-link"
										text="תנאי התמיכה "
										fontWeight="600"
										textDecoration="none"
										url="#"
										onClick={ () => { dispatch(openModal({ modalType: 'termsOfPayment' }))}}
									/>
								</SC.TermsOfUseCheckboxWrapper>
								<HelperText id="terms-of-paymeny-error-helper-text" text="" error={triedSubmit ? formErrors.termsAcceptedError.message : ''}/>
							</SC.TermsOfUseWrapper>
							<SC.ButtonWrapper>
								<Button id="payment-button" text="תמכו במעירים" onClick={ handlePaymentRequest }/>
							</SC.ButtonWrapper>
						</TabPanel>
					</SC.PaymentWrapper>
				</SC.InputsWrapper>
				<SC.TeamMembersWrapper ref={whoWeAreRef}>
					<SC.SectionTitleWithHorizontalDividersWrapper>
						<Divider orientation="horizontal"/>
						<SC.SectionTitle large>מי אנחנו</SC.SectionTitle>
						<Divider orientation="horizontal"/>
					</SC.SectionTitleWithHorizontalDividersWrapper>
					<SC.AboutUsSection>
						<Typography component="span" variant="largeParagraphText" mobileVariant="paragraphText" color={theme.palette.black}>
							{t.fundingAboutUsText}
						</Typography>
					</SC.AboutUsSection>
					<TeamMembers/>
				</SC.TeamMembersWrapper>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default FundingPage;
