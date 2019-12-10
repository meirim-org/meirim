import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import Rating from "react-rating";
import api from "../../services/api";

import "../../assets/bootstrap.css";
import "./Rate.css";

const signInURL = {
    pathname: "/sign/in",
    state: {
        redirectTo: window.location.pathname
    }
};

const ratingsValues = {
    5: "התוכנית מעולה ואני תומך/ת",
    4: "התוכנית סבירה ואני תומך/ת",
    3: "לא מתנגד/ת או תומך/ת",
    2: "התוכנית דורשת שיפור ואני מתנגד/ת",
    1: "התוכנית תפגע בסביבתה ואני מתנגד/ת"
};

class Rate extends Component {
    state = {
        score: 0,
        tempScore: 0,
        isLoading: true,
        me: this.props.me || {},
        error: false,
        goToLogin: false,
        max: 0,
        numRatings: 0,
        average: 0,
        ratings: Object.keys(ratingsValues).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {})
    };

    componentDidMount() {
        this.loadRatings();
    }

    loadRatings = () => {
        const { planId } = this.props;

        return api
            .get("/rate/" + planId)
            .then(d => {
                // init rating display array
                let ratings = Object.keys(ratingsValues).reduce((acc, key) => {
                    acc[key] = 0;
                    return acc;
                }, {});

                // set the rating we have
                for (let i = 0; d.data[i]; i++) {
                    ratings[d.data[i].score] = d.data[i].num;
                }

                const numRatings = d.data.length;
                const average =
                    Math.round(d.data.reduce((acc, r) => acc + r.score, 0) / numRatings * 100)/100;
                const max = d.data.reduce(
                    (acc, r) => (r.num > acc ? r.num : acc),
                    0
                );
                this.setState({
                    isLoading: false,
                    me: d.data.me,
                    max,
                    numRatings,
                    average,
                    ratings
                });
            })
            .catch(error => this.setState({ error }));
    };

    setRate = score => {
        const { planId, me } = this.props;
        if (!me) {
            return this.setState({ goToLogin: true });
        }
        return api
            .post("/rate/", { score, plan_id: planId })
            .then(ratings => {
                this.setState({ score });
                return this.loadRatings();
            })
            .catch(error => this.setState({ error }));
    };

    hoverRate = rate => {
        this.setState({ tempRate: rate });
    };

    render() {
        const {
            score,
            tempRate,
            goToLogin,
            max,
            numRatings,
            average,
            ratings
        } = this.state;
        const displayRate = tempRate || score;
        if (goToLogin) {
            return <Redirect to={signInURL} />;
        }

        return (
            <Fragment>
                עד כמה אתם חושבים שהתוכנית מטיבה עם סביבתה?
                <div className="row">
                    <div className="col-5">
                        <Rating
                            direction="rtl"
                            onClick={this.setRate}
                            onHover={this.hoverRate}
                            initialRating={score}
                        />
                    </div>
                    <div className="col-7">{ratingsValues[displayRate]}</div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div style={{ fontSize: 48 }}>
                            {average ? average : "- -"}
                        </div>
                        <div>{numRatings} דירוגים</div>
                    </div>
                    <div className="col-8">
                        {Object.values(ratings).map((rating, index) => {
                            const width = (rating / max) * 100;
                            return (
                                <div className="row">
                                    <div className="col-2">{index + 1}</div>
                                    <div className="col-10">
                                        <div class="progress">
                                            <div
                                                class="progress-bar bg-warning"
                                                role="progressbar"
                                                aria-valuenow={rating}
                                                style={{
                                                    width: `${width}%`
                                                }}
                                                aria-valuemin="0"
                                                aria-valuemax={max}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Fragment>
        );
    }
}

Rate.propTypes = {
    planId: PropTypes.number,
    me: PropTypes.object
};

export default Rate;
