import React from 'react';
import PropTypes from 'prop-types';
import {
	Dropdown, TextInput, TextArea, Button, Link,
} from '../../shared';
import * as SC from './style';
import { personTypes } from './constants';
import { AddressInput } from 'shared';

const SecondStepSignup = ({ handleSubmit, values, setValues, setAddress }) => {
	const { address, type, aboutme } = values;

	return (
		<SC.MainWrapper>
			<SC.Titles>
				<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
			</SC.Titles>
			<SC.InputsWrapper>
				<SC.InputWrapper>
					<AddressInput 
						id="register-address-input"
						label={"כתובת"}
						helperText="כדי לקבל עדכונים על מה בונים לך ליד הבית" 
						setAddress={setAddress}
					/>
				</SC.InputWrapper>
				<SC.InputWrapper>
					<Dropdown
						id="register-type-input"
						value={type}
						onChange={({ target: { value } }) => setValues({ type: value, aboutme }) }
						options={personTypes}
						label="מי אני" />
				</SC.InputWrapper>
				<SC.InputWrapper>
					<TextArea
						id="register-aboutme-input"
						value={aboutme}
						onChange={({ target: { value } }) => setValues({ type, aboutme: value })}
						helperText="כדי ששאר חברי הקהילה יכירו אותך"
						label="קצת עליך" />
				</SC.InputWrapper>
			</SC.InputsWrapper>
			<SC.ButtonWrapper smallPadding>
				<Button id="register-send-form-button" text="הרשמה למעירים" onClick={handleSubmit} />
			</SC.ButtonWrapper>
			<SC.TermsOfUseWrapper>
				<SC.TermsOfUse>בלחיצה על ״הרשמה למעירים״ הנך מאשר/ת את </SC.TermsOfUse>
				<Link id="register-terms-of-use" text="תנאי השימוש" url="/terms/" fontWeight="700" target="_blank" rel="noopener noreferrer"/>
			</SC.TermsOfUseWrapper>
		</SC.MainWrapper>
	);
};

SecondStepSignup.propTypes = {
	values: PropTypes.shape({
		type: PropTypes.string.isRequired,
		aboutme: PropTypes.string,
	}).isRequired,
	setValues: PropTypes.func.isRequired,
	setAddress: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

export default SecondStepSignup;
