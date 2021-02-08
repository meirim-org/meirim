import React from "react";
import { Link } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import logo from "../assets/logo.png";

export default function NotFound() {
    return (
        <Wrapper>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="group">
                            <img
                                className="eyelashes"
                                src={logo}
                                alt="מעירים"
                            />
                            <div className="goodMorning" id="goodMorningText">
                                404
                                <br />
                                לא נמצא
                            </div>
                            <div className="selectAreaAndInterest">
                                לא מצאנו את העמוד, יכול להיות שהתוכנית נמחקה או
                                שהקישור שבור.
                                <br />
                                בכל מקרה- אפשר לחפש תוכניות שמעניינות אתכם&nbsp;
                                <Link to="/plans">כאן</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
