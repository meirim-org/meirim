import React from "react";
import Wrapper from "../components/Wrapper";
import RegisterForm from "../components/RegisterForm";

import t from "../locale/he_IL";
import traktor from "../assets/traktor_op.png";
import logoSmall from "../assets/logo_small.png";
import "../assets/bootstrap.css";
import "./Home.css";

export default function Home(props) {
    const { me } = props;
    return (
        <Wrapper me={me}>
            <div
                className="d-none d-md-block"
                style={{
                    width: "50%",
                    position: "absolute",
                    height: "100%",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundImage: `url(${traktor})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50% 50%"
                }}
            />
            <div className="container heroContainer">
                <section className="hero">
                    <div className="content">
                        <img className="logo" src={logoSmall} alt={t.name} />
                        <div className="d-lg-none">
                            <h4>{t.meirimTitle}</h4>
                            <p>{t.whatToRegister}</p>
                            <a href="#register" className="join">
                                {t.callToAction}
                            </a>
                        </div>
                    </div>
                </section>
                <div className="row garden">
                    <div className="col-lg-4">
                        <h2>{t.whyRegister}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <p>{t.howItWorks}</p>
                    </div>
                    <div className="col-lg-4">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
