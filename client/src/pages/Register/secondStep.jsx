import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Link, TextArea, TextInput } from '../../shared';
import { usePersonTypes } from './constants';
import * as SC from './style';

const SecondStepSignup = ({ handleSubmit, values, setValues, typeError }) => {
	const personTypes = usePersonTypes();
	const dropdownOptions = [{
		value: "",
		text: "-"
	}, ...personTypes]
	const { address, type, aboutme } = values;
	const { t } = useTranslation();
	return (
		<SC.MainWrapper>
			<SC.Titles>
				<SC.Title>{t.joinMeirimCommunity}</SC.Title>
			</SC.Titles>
			<SC.InputsWrapper>
				<SC.InputWrapper>
					<TextInput
						id="register-address-input"
						name="adress"
						label={t.address}
						type="text"
						value={address}
						onChange={({ target: { value } }) => setValues({ type, aboutme, address: value })}
						helperText={t.toGetUpdates} />
				</SC.InputWrapper>
				<SC.InputWrapper>
					<Dropdown
						id="register-type-input"
						value={type}
						onChange={({ target: { value } }) => setValues({ type: value, aboutme, address }) }
						options={dropdownOptions}
						label={t.whoAmI}
						helperText={typeError ?? undefined}
						error={typeError !== null}
					/>
				</SC.InputWrapper>
				<SC.InputWrapper>
					<TextArea
						id="register-aboutme-input"
						value={aboutme}
						onChange={({ target: { value } }) => setValues({ type, aboutme: value, address })}
						helperText={t.soMemembersKnowWhoYouAre}
						label={t.aboutYou} />
				</SC.InputWrapper>
			</SC.InputsWrapper>
			<SC.ButtonWrapper smallPadding>
				<Button id="register-send-form-button" text={t.signupToMeirim} onClick={handleSubmit} />
			</SC.ButtonWrapper>
			<SC.TermsOfUseWrapper>
				<SC.TermsOfUse>{t.youAreConfirming}</SC.TermsOfUse>
				<Link id="register-terms-of-use" text={t.termsOfUse} url="/terms/" fontWeight="700" target="_blank" rel="noopener noreferrer"/>
				<SC.TermsOfUse> ו</SC.TermsOfUse>
				<Link id="register-terms-of-use" text={t.privacyPolicy} url="/privacy-policy/" fontWeight="700" target="_blank" rel="noopener noreferrer"/>
			</SC.TermsOfUseWrapper>
		</SC.MainWrapper>
	);
};

SecondStepSignup.propTypes = {
	values: PropTypes.shape({
		address: PropTypes.string,
		type: PropTypes.string.isRequired,
		aboutme: PropTypes.string,
	}).isRequired,
	setValues: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

export default SecondStepSignup;
