import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import _ from "lodash";
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

// convert ratings to nice rating hash
const organizeRatings = ratings => {
    let initRating = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };
    const max = ratings.reduce((acc, r) => (r.num > acc ? r.num : acc), 0);
    ratings.map(rating => {
        initRating[rating.score] = rating.num;
    });
    const numRatings = ratings.length;
    const average = ratings.reduce((acc, r) => acc + r.score, 0) / numRatings;

    return {
        max,
        numRatings,
        average,
        ratings: initRating
    };
};

class Rate extends Component {
    state = {
        score: 0,
        tempScore: 0,

        isLoading: true,
        me: this.props.me || {},
        error: false,
        goToLogin: false,
        ratings: []
    };

    componentDidMount() {
        const { planId } = this.props;

        return api
            .get("/rate/" + planId)
            .then(ratings => {
                this.setState({
                    isLoading: false,
                    me: ratings.me,
                    ratings: ratings.data
                });
            })
            .catch(error => this.setState({ error }));
    }

    setRate = score => {
        const { planId, me } = this.props;
        if (!me) {
            return this.setState({ goToLogin: true });
        }
        return api
            .post("/rate/", { score, plan_id: planId })
            .then(ratings => {
                this.setState({ score });
                this.componentDidMount();
            })
            .catch(error => this.setState({ error }));
    };

    hoverRate = rate => {
        this.setState({ tempRate: rate });
    };

    render() {
        const { me, score, tempRate, goToLogin, ratings } = this.state;
        const displayRate = tempRate || score;
        if (goToLogin) {
            return <Redirect to={signInURL} />;
        }

        const organizedRatings = organizeRatings(ratings);

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
                    <div className="col-7">
                        {displayRate === 1 &&
                            "התוכנית תפגע בסביבתה ואני מתנגד/ת"}
                        {displayRate === 2 &&
                            "התוכנית דורשת שיפור ואני מתנגד/ת"}
                        {displayRate === 3 && "לא מתנגד/ת או תומך/ת"}
                        {displayRate === 4 && "התוכנית סבירה ואני תומך/ת"}
                        {displayRate === 5 && "התוכנית מעולה ואני תומך/ת בה"}
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div style={{ fontSize: 48 }}>
                            {organizedRatings.average? organizedRatings.average: '- -'}
                        </div>
                        <div>{organizedRatings.numRatings} דירוגים</div>
                    </div>
                    <div className="col-8">
                        {Object.values(organizedRatings.ratings).map(
                            (rating, index) => {
                                const width =
                                    (rating / organizedRatings.max) * 100;
                                return (
                                    <div className="row">
                                        <div className="col-2">{index + 1}</div>
                                        <div className="col-10">
                                            <div class="progress">
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow={rating}
                                                    style={{
                                                        width: `${width}%`
                                                    }}
                                                    aria-valuemin="0"
                                                    aria-valuemax={
                                                        organizedRatings.max
                                                    }
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
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
