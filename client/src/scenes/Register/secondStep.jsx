import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal, Dropdown, TextInput, TextArea, Button,
} from '../../shared';
import * as SC from './style';

const dropDownOptions = [
	{
		value: '1',
		text: ' תושב/ת שכאפת לו/ה',
	},
	{
		value: '2',
		text: 'אתה אתה אתה',
	},
	{
		value: '3',
		text: 'אני אני אני',
	},
];

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
						<TextInput name="adress" label="כתובת" type="text" value={address} onChange={({ target: { value } }) => setValues({ type, aboutme, address: value })} helperText="כדי לקבל עדכונים על מה בונים לך ליד הבית" />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<Dropdown value={type} onChange={({ target: { value } }) => setValues({ type: value, aboutme, address })} options={dropDownOptions} required label="מי אני" />
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextArea value={aboutme} onChange={({ target: { value } }) => setValues({ type, aboutme: value, address })} helperText="כדי ששאר חברי הקהילה יכירו אותך" label="קצת עליך" />
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך" onClick={handleSubmit} />
				</SC.ButtonWrapper>
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
