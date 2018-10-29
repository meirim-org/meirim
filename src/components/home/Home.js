import React from "react";

import logo from '../../assets/logo_small.png';
import traktor_op from '../../assets/traktor_op.png';
import Register from '../register';


const Home = () => (
  <div className="container heroContainer">
    <section className="hero">
      <img className="img-fluid background" src={traktor_op} alt="טרקטור"/>
      <div className="content">
        <img className="logo" src={logo} alt="לוגו מעירים"/>
        <div className="d-lg-none">
          <h4>מידע תכנוני ואקטיביזם עירוני</h4>
          <p>רוצים השכמה?</p>
          <a href="#register" className="join">הצטרפו למעירים</a>
        </div>
      </div>
    </section>
    <div className="row garden">

      <div className="col-lg-4">
        <h2>רוצים לדעת אם הגינה הציבורית שלכם עומדת
          <strong>להפוך למגדל?</strong>
        </h2>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-4">
        <p>
          מערכת ההתראות שלנו מאגדת במקום אחד את כל התכניות בסמכות מקומית ומחוזית ותשלח לכם
          התראה למייל בזמן אמת, בכל פעם שתופקד תכנית חדשה בסמכות מקומית או כשתקלט במערכת
          תכנית חדשה בסמכות מחוזית באזור מגוריכם או בכל אזור אחר שתבחרו! כך תוכלו לעקוב
          בקלות אחרי השינויים בסביבת המגורים שלכם.
        </p>
      </div>
      <div className="col-lg-4">
        <a id="register"></a>
        <Register />
      </div>
    </div>
  </div>
);
export default Home;