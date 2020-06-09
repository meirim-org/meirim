import React, { Fragment } from "react";
import Wrapper from "../components/Wrapper";
// import Keywords from "../assets/keywords";

import "./Funding.css";

export default function Vocabulary(props) {
    const { me } = props;
    return (
        <Wrapper me={me}>
            <div className="container">
                <h1>מילון שימושי קרקע</h1>
                <p>
                    בתכנון עירוני נהוג להגדיר מראש את השימושים המותרים בשטח
                    מסויים. בעוד אסכולות מסוימות דוגלות בחיוניות של הקצאת שטחים
                    שונים לשימושים שונים (ידוע בשם הפרדת שימושים) אחרות קוראות
                    להקצאות קרקע אחת ליותר משימוש אחד (נגיד, מגורים ומסחר ביחד),
                    לפחות במקרים מסויימים (ידוע בשם עירוב שימושים). לפניכם רשימה
                    של שימושי הקרקע בהם עושים שימוש בישראל המלווים בהסבר קצר.
                </p>
                {/* {Keywords.map(word => (
                    <Fragment>
                        <h4>{word.title}</h4>
                        <p>{word.description}</p>
                    </Fragment>
                ))} */}
            </div>
        </Wrapper>
    );
}
