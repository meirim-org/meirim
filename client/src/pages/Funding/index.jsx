import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import YoutubeVideo from 'react-youtube';
import { openModal } from 'redux/modal/slice';
import { FundingSelectors } from 'redux/selectors';
import { externalPaymentErrorToast } from 'toasts';
import Wrapper from '../../components/Wrapper';
import { reportToAnalytics } from 'utils';
import {
	Button,
	Checkbox,
	Divider,
	HelperText,
	Link,
	Chip,
	/*ProgressBar, */ TabPanel,
	TeamMembers,
	Typography,
} from '../../shared';
import AmountInput from './amountInput';
import {
	fundingYoutubeVideoId,
	paymentAmountOptions,
	roadmap,
} from './constants';
import { createPaymentLink } from './controller';
import {
	useStatsDataHandler,
	useSuccessCloseHandler,
	useSectionAnchor,
} from './hooks';
import * as SC from './style';
import { getFormErrors, paymentRequestValidation } from './validations';
import { openSuccessModal } from './helpers';

const FundingPage = ({ ...props }) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const whoWeAreRef = useRef();
	const paymentRef = useRef();
	const { t } = useTranslation();

	const [otherAmount, setOtherAmount] = useState(0);
	const [amount, setAmount] = useState();
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [triedSubmit, setTriedSubmit] = useState(false);
	const [paymentDone, setPaymentDone] = useState(0);
	const [formErrors, setFormErrors] = useState({
		amountError: { isValid: true, message: '' },
		termsAcceptedError: { isValid: true, message: '' },
	});
	const [monthlyPayment, setMonthlyPayment] = useState(true);

	const validateFormInput = useCallback(() => {
		const { isValidAmount, isValidAcceptedTerms } =
			paymentRequestValidation({ amount, termsAccepted });
		const { amountError, termsAcceptedError } = getFormErrors({
			validations: { isValidAmount, isValidAcceptedTerms },
			values: { amount, termsAccepted },
		});

		setFormErrors({ ...formErrors, amountError, termsAcceptedError });
		return { isValidAmount, isValidAcceptedTerms };
	}, [amount, termsAccepted, formErrors]);

	const handlePaymentRequest = async () => {
		setTriedSubmit(true);
		const { isValidAmount, isValidAcceptedTerms } = validateFormInput();
		if (!isValidAmount || !isValidAcceptedTerms) return;

		try {
			debugger;
			const paymentpageUrl = await createPaymentLink({
				amount,
				monthlyPayment,
			});
			dispatch(
				openModal({
					modalType: 'payment',
					modalProps: { url: paymentpageUrl },
				})
			);
		} catch (err) {
			externalPaymentErrorToast();
		}
	};

	useStatsDataHandler(paymentDone);

	function paymentSuccess() {
		reportToAnalytics({
			event: 'donation-complete',
			d_type: 'monthly',
			d_value: amount,
		});
		setAmount(null);
		setOtherAmount(0);
		setTermsAccepted(false);
		setTriedSubmit(false);
		setPaymentDone(paymentDone + 1);
	}
	useSuccessCloseHandler(paymentSuccess);

	useSectionAnchor(props.location.hash, paymentRef, whoWeAreRef);

	const { statsData } = FundingSelectors();

	return (
		<Wrapper>
			<SC.MainWrapper>
				<SC.HeaderWrapper>
					<SC.Titles>
						<SC.SubTitleWrapper>
							<SC.MainTitle>{t.fundingMainTitle}</SC.MainTitle>
							<SC.SubTitle>{t.fundingSubTitle}</SC.SubTitle>
							<SC.SubTitle fontWeight="600">
								{t.fundingSubTitleBold}
							</SC.SubTitle>
							<br />
							<br />
							<SC.SubTitle>{t.fundingExplanation}</SC.SubTitle>
							<br />
							<br />
							<Chip
								text={t.readMoreAboutAchievements}
								onClick={openSuccessModal}
							/>
						</SC.SubTitleWrapper>
					</SC.Titles>
					<SC.MediaContent>
						<YoutubeVideo
							opts={{ width: '100%' }}
							videoId={fundingYoutubeVideoId}
						/>
					</SC.MediaContent>
				</SC.HeaderWrapper>
				<SC.InputsWrapper>
					<SC.RoadMapWrapper>
						<TabPanel>
							<SC.RoadmapDetails>
								<SC.SectionTitleWithHorizontalDividersWrapper>
									<Divider orientation="horizontal" />
									<SC.SectionTitle>
										מה בתוכנית?{' '}
									</SC.SectionTitle>
									<Divider orientation="horizontal" />
								</SC.SectionTitleWithHorizontalDividersWrapper>
								{roadmap.map((i) => (
									<SC.RoadmapItemWrapper key={i.id}>
										<SC.RoadmapItemIcon>
											{i.icon}
										</SC.RoadmapItemIcon>
										<SC.RoadmapItemTitle>
											{' '}
											{i.title}{' '}
										</SC.RoadmapItemTitle>
										<SC.RoadmapItemDescription>
											{' '}
											{i.description}{' '}
										</SC.RoadmapItemDescription>
									</SC.RoadmapItemWrapper>
								))}
							</SC.RoadmapDetails>
						</TabPanel>
					</SC.RoadMapWrapper>
					<Divider orientation="vertical" />
					<SC.PaymentWrapper ref={paymentRef}>
						<SC.SectionTitle>
							{t.fundingSectionTitle}
						</SC.SectionTitle>
						<TabPanel>
							<SC.FundingStatsWrapper>
								<SC.CentredSubTitle>
									{' '}
									<bold>
										{statsData.count.toLocaleString('en')}{' '}
									</bold>
									תומכים כבר עוזרים לזה לקרות
								</SC.CentredSubTitle>
								{/* <div>
									<ProgressBar id="funding-stats-progressbar" value={statsData.totalAmount / fundingEndGoal * 100} width="100%"/>
								</div> */}
								{/* <SC.FundingStatsNumbersWrapper>
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
								</SC.FundingStatsNumbersWrapper> */}
							</SC.FundingStatsWrapper>
							<SC.PaymentTypeButtonsWrapper ref={paymentRef}>
								<SC.PaymentTypeButton
									side="right"
									selected={monthlyPayment}
									onClick={() => {
										setMonthlyPayment(true);
									}}
								>
									<Typography
										component="span"
										variant="planTitle"
										mobileVariant="cardTitle"
										color={theme.palette.primary['main']}
									>
										{t.monthlyPayment}
									</Typography>
								</SC.PaymentTypeButton>
								<SC.PaymentTypeButton
									side="left"
									selected={!monthlyPayment}
									onClick={() => {
										setMonthlyPayment(false);
									}}
								>
									<Typography
										component="span"
										variant="planTitle"
										mobileVariant="cardTitle"
										color={theme.palette.primary['main']}
									>
										{t.singleTimePayment}
									</Typography>
								</SC.PaymentTypeButton>
							</SC.PaymentTypeButtonsWrapper>
							<SC.PaymentOptionsWrapper>
								{paymentAmountOptions.map((o) => (
									<SC.PaymentOption
										key={`amount-option-${o}`}
										className={amount === o ? 'active' : ''}
										onClick={() => {
											setAmount(o);
										}}
									>
										<SC.Amount>
											{o} {t.fundingShekel}
										</SC.Amount>
									</SC.PaymentOption>
								))}
								<SC.PaymentOption
									className={
										amount === otherAmount
											? 'active longer'
											: 'longer'
									}
									onClick={() => {
										setAmount(otherAmount);
									}}
								>
									<SC.PaymentOtherOption>
										<SC.OtherAmountInput
											id="other-amount-input"
											name="other-amount"
											placeholder="סכום אחר"
											onChange={({
												target: { value },
											}) => {
												setOtherAmount(
													Number.parseInt(value)
												);
												setAmount(
													Number.parseInt(value)
												);
											}}
											disableUnderline={true}
											inputComponent={AmountInput}
										/>
									</SC.PaymentOtherOption>
								</SC.PaymentOption>
								<HelperText
									id="amount-error-helper-text"
									text=""
									error={
										triedSubmit
											? formErrors.amountError.message
											: ''
									}
								/>
							</SC.PaymentOptionsWrapper>
							<SC.TermsOfUseWrapper>
								<SC.TermsOfUseCheckboxWrapper>
									<Checkbox
										id="terms-accepted-checkbox"
										text=""
										checked={termsAccepted}
										onClick={() => {
											setTermsAccepted(!termsAccepted);
										}}
									/>
									<span>אני מאשר/ת את&nbsp;</span>
									<Link
										id="funding-terms-of-payment-link"
										text="תנאי התמיכה "
										fontWeight="600"
										textDecoration="none"
										url="#"
										onClick={() => {
											dispatch(
												openModal({
													modalType: 'termsOfPayment',
												})
											);
										}}
									/>
								</SC.TermsOfUseCheckboxWrapper>
								<HelperText
									id="terms-of-paymeny-error-helper-text"
									text=""
									error={
										triedSubmit
											? formErrors.termsAcceptedError
													.message
											: ''
									}
								/>
							</SC.TermsOfUseWrapper>
							<SC.ButtonWrapper>
								<Button
									id="payment-button"
									text={
										monthlyPayment
											? t.startMonthlyPayment
											: t.singleTimePayment
									}
									onClick={handlePaymentRequest}
								/>
							</SC.ButtonWrapper>
						</TabPanel>
					</SC.PaymentWrapper>
				</SC.InputsWrapper>
				<SC.TeamMembersWrapper ref={whoWeAreRef}>
					<SC.SectionTitleWithHorizontalDividersWrapper>
						<Divider orientation="horizontal" />
						<SC.SectionTitle large>מי אנחנו</SC.SectionTitle>
						<Divider orientation="horizontal" />
					</SC.SectionTitleWithHorizontalDividersWrapper>
					<SC.AboutUsSection>
						<Typography
							component="span"
							variant="largeParagraphText"
							mobileVariant="paragraphText"
							color={theme.palette.black}
						>
							{t.fundingAboutUsText}
						</Typography>
					</SC.AboutUsSection>
					<TeamMembers />
				</SC.TeamMembersWrapper>
			</SC.MainWrapper>
		</Wrapper>
	);
};

export default FundingPage;
