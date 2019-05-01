import React, { Component } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import RegisterForm from "../components/RegisterForm";

import t from "../locale/he_IL";
import traktor from "../assets/traktor_op.png";
import logoSmall from "../assets/logo_small.png";
import "./Home.css";

class Home extends Component {
  render() {
    const { me } = this.props;
    return (
      <React.Fragment>
        <Navigation me={me} />

        <div className="container heroContainer">
          <section className="hero">
            <img className="img-fluid background" src={traktor} alt="" />
            <div className="content">
              <img className="logo" src={logoSmall} alt={t.name} />
              <div className="d-lg-none">
                <h4>{t.meirimTitle}</h4>
                <p>רוצים השכמה?</p>
                <a href="#register" className="join">
                  הצטרפו למעירים
                </a>
              </div>
            </div>
          </section>
          <div className="row garden">
            <div className="col-lg-4">
              <h2>
                רוצים לדעת אם הגינה הציבורית שלכם עומדת{" "}
                <strong>להפוך למגדל?</strong>
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <p>
                מערכת ההתראות שלנו מאגדת במקום אחד את כל התכניות בסמכות מקומית
                ומחוזית ותשלח לכם התראה למייל בזמן אמת, בכל פעם שתופקד תכנית
                חדשה בסמכות מקומית או כשתקלט במערכת תכנית חדשה בסמכות מחוזית
                באזור מגוריכם או בכל אזור אחר שתבחרו! כך תוכלו לעקוב בקלות אחרי
                השינויים בסביבת המגורים שלכם.
              </p>
            </div>
            <div className="col-lg-4">
              <a id="register" />
              <RegisterForm />
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;
