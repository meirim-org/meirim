import React from 'react';
import * as Icons from 'assets/funding';

export const paymentAmountOptions = [20, 50, 75, 100, 150, 200];

export const roadmap = [
    {
        id: 'community',
        title: 'קהילה',
        description: 'למעירים יש אלפי משתמשים רשומים מכל רחבי הארץ - עכשיו הגיע לייצר חיבורים. אנחנו מפתחים ממשק ייחודי שיאפשר לחברי הוועדות להיות בקשר עם אנשי המקצוע והציבור, ולחבר בין תושבים המעוניינים להשפיע יחד על הרחוב, השכונה או העיר.',
        icon: <Icons.CommunityNewIcon/>
    }, {
        id: 'awareness',
        title: 'העלאת מודעות',
        description: 'לא נחכה שיגיעו עוד אנשים אלינו לאתר -  נדאג כבר שהתוכניות יגיעו אליהם! נפעיל כלים לפרסום דיגיטלי של תוכניות גדולות ודיונים בהחלטות חשובות שהולכות לשנות את פני הערים שלנו - גם במרכז וגם בפריפריה, גם בחברה היהודית וגם בחברה הערבית',
        icon: <Icons.AwarenessIcon/>  
    }, {
        id: 'public-policy',
        title: 'לובי ושינוי מדיניות ',
        description: 'יש לא מעט גורמים שנוח להם שהמצב יישאר כמו שהוא - מערכת תכנון מסורבלת, מסובכת ומרובת ניגודי עניינים. לכן אנחנו צריכים לוביסט שידאג לאינטרסים שלנו, כדי לדחוף להתייעלות ולשינויים בתקנות ובחוקים בתחום התכנון והבנייה, הנגשת המידע, ובמלחמה בשחיתות',
        icon: <Icons.PolicyIcon/> 
    }
];

export const fundingEndGoal = 100000;

export const fundingYoutubeVideoId = 'e1Q7zj_2f0I';

export const successPageTransactionCompleteMessage = 'success-page-transaction-complete';
