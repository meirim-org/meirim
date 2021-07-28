import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Link, TextArea, TextInput } from '../../shared';
import { personTypes } from './constants';
import * as SC from './style';

const SecondStepSignup = ({ handleSubmit, values, setValues }) => {
	const { address, type, aboutme } = values;
	const { translate } = useTranslation();

	return (
		<SC.MainWrapper>
			<SC.Titles>
				<SC.Title>{translate.joinMeirimCommunity}</SC.Title>
			</SC.Titles>
			<SC.InputsWrapper>
				<SC.InputWrapper>
					<TextInput
						id="register-address-input"
						name="adress"
						label={translate.address}
						type="text"
						value={address}
						onChange={({ target: { value } }) => setValues({ type, aboutme, address: value })}
						helperText="כדי לקבל עדכונים על מה בונים לך ליד הבית" />
				</SC.InputWrapper>
				<SC.InputWrapper>
					<Dropdown
						id="register-type-input"
						value={type}
						onChange={({ target: { value } }) => setValues({ type: value, aboutme, address }) }
						options={personTypes}
						label="מי אני" />
				</SC.InputWrapper>
				<SC.InputWrapper>
					<TextArea
						id="register-aboutme-input"
						value={aboutme}
						onChange={({ target: { value } }) => setValues({ type, aboutme: value, address })}
						helperText="כדי ששאר חברי הקהילה יכירו אותך"
						label="קצת עליך" />
				</SC.InputWrapper>
			</SC.InputsWrapper>
			<SC.ButtonWrapper smallPadding>
				<Button id="register-send-form-button" text="הרשמה למעירים" onClick={handleSubmit} />
			</SC.ButtonWrapper>
			<SC.TermsOfUseWrapper>
				<SC.TermsOfUse>בלחיצה על הכפתור הנך מאשר/ת את </SC.TermsOfUse>
				<Link id="register-terms-of-use" text={translate.termsOfUse} url="/terms/" fontWeight="700" target="_blank" rel="noopener noreferrer"/>
				<SC.TermsOfUse> ו</SC.TermsOfUse>
				<Link id="register-terms-of-use" text={translate.privacyPolicy} url="/privacy-policy/" fontWeight="700" target="_blank" rel="noopener noreferrer"/>
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
