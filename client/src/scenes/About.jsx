import React from "react";
import Wrapper from "../components/Wrapper";

import "./About.css";

import eyal from "../assets/team/eyal.png";
import talia from "../assets/team/talia.png";
import yonatan from "../assets/team/yonatan.png";
import ann from "../assets/team/ann.png";
import shira from "../assets/team/shira.png";
import gal from "../assets/team/gal.png";

const About = () => {
    return (
        <Wrapper>
            <div className="container">
                <div className="row pt-4">
                    <div className="col-lg-4">
                        <h2>צוות מעירים</h2>
                        <p>
                            אנו פועלים לשינוי סדר היום במערכת התכנון וחותרים
                            להפרדת רשויות וייצוג הולם לכל שכבות האוכלוסייה תוך
                            שמירה על האינטרס הסביבתי. מעירים הנו פרויקט עצמאי.
                        </p>
                        <p className="short-desc">
                            אנחנו קבוצה עצמאית, קטנה ונחושה של אדריכלים, מתכנתים
                            ומעצבת שעובדת ימים ולילות בהתנדבות במטרה להגביר את
                            השקיפות במערכת התכנון ולעודד אקטיביזם עירוני. זה
                            הצוות שלנו:
                        </p>
                    </div>
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-6 col-lg-4">
                                <div className="m-3 text-center">
                                    <img
                                        className="img-fluid"
                                        src={eyal}
                                        alt="איל מגדלוביץ"
                                    />
                                    <div className="d-block text-center">
                                        איל מגדלוביץ
                                    </div>
                                    אדריכל ומנהל מעירים
                                </div>
                            </div>
                            <div className="col-6 col-lg-4">
                                <div className="m-3 text-center">
                                    <img
                                        className="img-fluid"
                                        src={talia}
                                        alt="טליה מרגלית"
                                    />
                                    <div className="d-block text-center">
                                        דר' טליה מרגלית
                                    </div>
                                    אדריכלית, חוקרת ויועצת אקדמית
                                </div>
                            </div>
                            <div className="col-6 col-lg-4">
                                <div className="m-3 text-center">
                                    <img
                                        className="img-fluid"
                                        src={yonatan}
                                        alt="יונתן דורטהיימר"
                                    />
                                    <a
                                        href="http://dortheimer.com"
                                        className="d-block text-center text-center"
                                    >
                                        יונתן דורטהיימר
                                    </a>
                                    מתכנת, אדריכל וחוקר
                                </div>
                            </div>

                            <div className="col-6 col-lg-4">
                                <div className="m-3 text-center">
                                    <img
                                        className="img-fluid"
                                        src={ann}
                                        alt="אן לילמנסטונס"
                                    />
                                    <div className="d-block text-center">
                                        אן לילמנסטונס
                                    </div>
                                    מעצבת UX/UI
                                </div>
                            </div>
                            <div className="col-6 col-lg-4">
                                <div className="m-3 text-center">
                                    <img
                                        className="img-fluid"
                                        src={shira}
                                        alt="שירה אפרתי"
                                    />
                                    <div className="d-block text-center">
                                        שירה אפרתי
                                    </div>
                                    אדריכלית
                                </div>
                            </div>

                            <div className="col-6 col-lg-4">
                                <div className="m-3 text-center">
                                    <img
                                        className="img-fluid"
                                        src={gal}
                                        alt="גל גנדלר"
                                    />
                                    <div className="d-block text-center">
                                        גל גנדלר
                                    </div>
                                    מתכנתת
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default About;
