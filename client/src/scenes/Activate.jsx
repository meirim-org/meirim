import React, { Component } from "react";
import queryString from "query-string";
import Wrapper from "../components/Wrapper";
import { Link } from 'shared';

import api from "../services/api";

import t from "../locale/he_IL";
import logo from "../assets/logo.png";
import "./Activate.css";

class Activate extends Component {
    state = {
        step: 0,
        error: 0
    };

    componentDidMount() {
        const { token } = queryString.parse(this.props.location.search);

        if (!token) {
            return this.setState({ step: -1, error: "No token" });
        }
        api.post("/sign/activate", { token })
            .then(success => this.setState({ step: 1 }))
            .catch(error =>
                this.setState({ step: -1, error: "We got an error" })
            );
    }
    render() {
        const { step, error } = this.state;

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
                                <div
                                    className="goodMorning"
                                    id="goodMorningText"
                                >
                                    {t.accountActivationTitle}
                                </div>
                                <div className="selectAreaAndInterest">
                                    {step === 0 && t.accountActivationLoading}
                                    {step === 1 && (
                                        <>
                                            {t.accountActivationSuccessPrefix}
                                            <Link id="my-alerts-link" text={t.accountActivationSuccessAlerts} url="/alerts/" textDecoration="none"/>
                                            {t.accountActivationSuccessSuffix}
                                        </>
                                    )}
                                    {step === -1 && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default Activate;
