import React from "react"
import { Modal, TextInput, Button } from "../../shared"
import * as SC from "./style"

const RegisterForm = () => {
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
						<TextInput name="name" label="שם מלא" type="text"/>
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput name="email" label="אימייל" type="email"/>
					</SC.InputWrapper>
					<SC.InputWrapper>
						<TextInput name="password" label="סיסמא" type="password"/>
					</SC.InputWrapper>
				</SC.InputsWrapper>
				<SC.ButtonWrapper>
					<Button text="המשך"/>
				</SC.ButtonWrapper>
			</SC.MainWrapper>
		</Modal>
	)
}

export default RegisterForm