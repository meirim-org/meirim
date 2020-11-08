import React from "react"
import { Modal,Dropdown, TextInput, TextArea, Button } from "../../shared"
import * as SC from "./style"

export const RegisterForm = () => {
	return (
		<Modal>
			<SC.MainWrapper>
				<SC.Titles>
					<SC.Title>בואו להיות חלק מקהילת מעירים!</SC.Title>
					<SC.SubTitleWrapper>
						<SC.SubTitle>כדי להשלים את הפעולה עלכים להיות מחוברים</SC.SubTitle>
						<SC.SubTitle>כבר רשומים? <SC.Link>התחברות</SC.Link></SC.SubTitle>
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
						<TextInput name="password" label="סיסמא" type="password" required={true}/>
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך"/>
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
	)
}

export const UserInfoForm = () => {
	const dropDownOptions =  [
		{
			value: 1,
			text:" תושב/ת שכאפת לו/ה"
		}
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