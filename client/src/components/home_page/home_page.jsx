import React from 'react';
import HomePageForm from '../containers/home_page_form_container';
import Partners from './components/partners/partners';
import Team from './components/team/team';
import Footer from './components/footer/footer';

require('./home_page.scss');

const HomePage = () => {
  return (
    <main className='home-page column'>
      <div className={'row'}>
        <div className='contant'>
          <img className='make-it-fit' src={require('../../images/logo_small.png')} alt="äúîåðä çñøä" />
          <div className="header-question">
            <h1>
              הגינה הציבורית שלכם
              <br />
              עומדת להפוך
              <span className='bold'> למגדל?</span>
            </h1>
          </div>
          <div className="about-us">
            <strong>קצת על מעירים</strong>
            <p>
              אנו פועלים לשינוי סדר היום במערכת התכנון וחתירה
                להפרדת רשויות וייצוג הולם לכל שכבות האוכלוסייה תוך
                שמירה על האינטרס הסביבתי. מעירים הנו פרויקט עצמאי
                המאומץ על ידי התנועה לחופש המידע.
            </p>
            <p>
              מערכת ההתרעות שלנו מאגדת במקום אחד את כל התכניות
              בסמכות מקומית ומחוזית ותשלח לכם התראה למייל בזמן אמת,
              בכל פעם שתופקד תכנית חדשה באזור מגוריכם כך שתוכלו לעקוב
              בקלות אחרי השינויים בסביבת המגורים שלכם.
            </p>
            <p>
              בקרוב מאוד נוסיף למערכת ההתראות מידע מועדות תכנון נוספות,
              נאפשר לייצר שיח סביב תכנית כזו או אחרת ונפתח פלטפורמה לתיעוד
              ועידוד אקטיביזם עירוני.
            </p>
            <p className="help-contact">
              הישארו איתנו,
              החברים ממעירים.

              <br />
              <p1>
                <a href="mailto:info@meirim.org">info@meirim.org</a>
              </p1>
            </p>
          </div>
        </div>
        <div className={'image-container'}>
          <img className='maavak-pic' src={require('../../images/traktor.png')} alt="התמונה חסרה" />
        </div>
        <HomePageForm />

      </div>
      <div className={'row'}>
        <Partners />
      </div>
      <div className={'row line'} />
      <div className={'row'}>
        <Team />
      </div>
      <div className={'row line'} />
      <div className={'row'}>
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
