import React from "react"
import * as SC from "./style"

const EmailSent = () => {
    return (
        <SC.MainWrapper>
            <SC.ContentCol>
                <SC.Content>
                    <SC.PreTitle>כמעט סיימנו...</SC.PreTitle>
                    <SC.Title>נשאר רק לאשר את <br/> כתובת האימייל שלך</SC.Title>
                    <SC.Text>שלחנו לך אימייל - לחיצה על הקישור שבתוכו תשלים את הרשמתך</SC.Text>
                    <SC.SmallTextWrapper>
                        <SC.SmallText>המייל לא הגיע? לשליחה חוזרת </SC.SmallText><SC.Link>לחצו כאן</SC.Link>
                    </SC.SmallTextWrapper>
                </SC.Content>
            </SC.ContentCol>
            <SC.ImageCol>
                <SC.Image src="./images/tolu-olubode-PlBsJ5MybGc-unsplash-3.jpg" alt="construction image"/>
            </SC.ImageCol>
        </SC.MainWrapper>
    )
}

export default EmailSent;
