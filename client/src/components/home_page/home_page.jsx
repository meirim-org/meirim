import React from 'react';
import HomePageForm from '../containers/home_page_form_container';
import Partners from './components/partners/partners';
import Team from './components/team/team';
import Footer from './components/footer/footer';

require('./home_page.scss');

const HomePage = () => {
  return (
    <main className='home-page column'>
      <div className={"row"}>
        <div className='contant'>
          <img className='make-it-fit' src={require('../../images/logo_small.png')} alt="äúîåðä çñøä"/>
          <div className="header-question">
            <h1>
              הגינה הציבורית שלכם
              <br/>
              עומדת להפוך
              <span className='bold'> למגדל?</span>
            </h1>
          </div>
          <div className="about-us">
            <strong>קצת על מעירים</strong>
            <br/>
            מעירים פועלים לשינוי סדר היום במערכת התכנון, חתירה
            <br/>
            להפרדת רשויות וייצוג הולם לכל שכבות האוכלוסייה תוך
            <br/>
            שמירה על האינטרס הסביבתי
            <br/>
            <br/>
            מערכת ההתרעות שלנו מאגדת במקום אחד את כל התוכניות
            <br/>
            שהופקדו וההיתרים שניתנו ברמה המקומית המחוזית וותמ"ל
            <br/>
            ותשלח לגם מייל בזמן אמת, בכל פעם שתופקד תכנית
            <br/>
            חדשה באיזור מגוריכם, כדי שתוכלו לדעול ולמנוע תכניות
            <br/>
            יזמיות הנובעות מאינטרס כלכלי על חשבון רווחת התושבים
            <br/>
            באיזורכם.
            <a href="">עוד</a>
          </div>
          <div className="help-contact">
            אנחנו כאן לכל שאלה, הבהרה ועניין
            <br/>
            <p1>
              EMAIL: info@meirim.co.org
            </p1>
          </div>
        </div>
        <div className={"image-container"}>
          <img className='maavak-pic' src={require("../../images/traktor.png")} alt="התמונה חסרה"/>
        </div>
        <HomePageForm/>

      </div>
      <div className={"row"}>
        <Partners/>
      </div>
      <div className={"row line"}/>
      <div className={"row"}>
        <Team/>
      </div>
      <div className={"row line"}/>
      <div className={"row"}>
        <Footer/>
      </div>
    </main>
  )
};

export default HomePage;
