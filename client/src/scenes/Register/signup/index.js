import React from "react"
import { Modal, Dropdown, TextInput, TextArea, Button, Link } from "../../../shared"
import * as SC from "./style"

const FirstStepSignup = () => {
	return (
		<Modal>
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
					<SC.SubTitleWrapper>
						<SC.SubTitle>כדי להשלים את הפעולה עלכים להיות מחוברים</SC.SubTitle>
						<SC.SubTitle>כבר רשומים? <Link text="התחברות"/></SC.SubTitle>
					</SC.SubTitleWrapper>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputsTitle>הרשמה למעירים</SC.InputsTitle>
					<SC.InputWrapper>
						<TextInput name="name" label="שם מלא" type="text" required={true}/>
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput name="email" label="אימייל" type="email" required={true}/>
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput name="signuppassword" label="סיסמא" type="password" required={true}/>
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך"/>
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
	)
}

const SecondStepSignup = () => {
	const dropDownOptions =  [
		{
			value: 1,
			text:" תושב/ת שכאפת לו/ה"
		},
		{
			value: 2,
			text:"אתה אתה אתה"
		},
		{
			value: 3,
			text:"אני אני אני"
		},
	]

	return ( 
		<Modal>
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
				</SC.Titles>
				<SC.InputsWrapper>
					<SC.InputWrapper>
						<TextInput name="name" label="כתובת" type="text" helperText="כדי לקבל עדכונים על מה בונים לך ליד הבית"/>
					</SC.InputWrapper>
					<SC.InputWrapper>
						<Dropdown options={dropDownOptions} required={true} label="מי אני"/>
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextArea helperText="כדי ששאר חברי הקהילה יכירו אותך" label="קצת עליך"/>
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך"/>
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
	)
}

const Signup = () => {
	return (
		<SecondStepSignup />
	)
}

export default Signup