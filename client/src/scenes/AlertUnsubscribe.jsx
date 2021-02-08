import React, { Component } from "react";

import Typography from "@material-ui/core/Typography";

import Wrapper from "../components/Wrapper";

import api from "../services/api";

//import t from "../locale/he_IL";
import "./Alerts.css";

class AlertUnsubscribe extends Component {
    state = {
        loading: true,
        error: false,
    };

    unsubscribeAlertByToken(token) {
        api.delete(`/alert/_token/${token}`)
            .then((result) => {
                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                console.log("error: " + error);
                this.setState({
                    loading: false,
                    error,
                });
            });
    }

    componentDidMount() {
        const { token } = this.props.match.params;

        this.unsubscribeAlertByToken(token);
    }

    render() {
        return (
            <Wrapper>
                <div className="container">
                    <Typography variant="h6">
                        {this.renderUnsubscribeStatus()}
                    </Typography>
                </div>
            </Wrapper>
        );
    }

    renderUnsubscribeStatus() {
        const { loading, error } = this.state;

        if (loading) {
            return "טוען...";
        } else if (error) {
            return "חלה שגיאה בעת מחיקת התראה. אנא נסו שנית";
        }

        return "ההתראה נמחקה";
    }
}

export default AlertUnsubscribe;
