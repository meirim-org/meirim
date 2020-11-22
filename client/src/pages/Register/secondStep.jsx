import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal, Dropdown, TextInput, TextArea, Button, Link,
} from '../../shared';
import * as SC from './style';
import { personTypes } from './constants'

const SecondStepSignup = ({ handleSubmit, values, setValues }) => {
	const { address, type, aboutme } = values;

	return (
		<Modal>
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputWrapper>
						<TextInput
							id="register-address-input"
							name="adress"
							label="כתובת"
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
							required={true} 
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
					<SC.TermsOfUse>בלחיצה על ״הרשמה למעירים״ הנך מאשר/ת את </SC.TermsOfUse>
					<Link text="תנאי השימוש" to="/sign/tom" bold={'700'} />
				</SC.TermsOfUseWrapper>
			</SC.MainWrapper>
		</Modal>
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
