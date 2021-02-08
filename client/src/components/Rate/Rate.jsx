import "assets/bootstrap.css";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Rating from "react-rating";
import { useDispatch } from "react-redux";
import { openModal } from "redux/modal/slice";
import { UserSelectors } from "redux/selectors";
import api from "services/api";

const ratingsValues = {
    5: "התוכנית מעולה ואני תומך/ת",
    4: "התוכנית סבירה ואני תומך/ת",
    3: "לא מתנגד/ת או תומך/ת",
    2: "התוכנית דורשת שיפור ואני מתנגד/ת",
    1: "התוכנית תפגע בסביבתה ואני מתנגד/ת",
};

const Rate = (props) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = UserSelectors();
    const [state, setState] = React.useState({
        score: 0,
        tempScore: 0,
        isLoading: true,
        error: false,
        goToLogin: false,
        max: 0,
        numRatings: 0,
        average: 0,
        ratings: Object.keys(ratingsValues).reduce((acc, key) => {
            acc[key] = 0;

            return acc;
        }, {}),
    });

    const loadRatings = React.useCallback(() => {
        const { planId } = props;

        return api
            .get("/rate/" + planId)
            .then((d) => {
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
                    Math.round(
                        (d.data.reduce((acc, r) => acc + r.score, 0) /
                            numRatings) *
                            100
                    ) / 100;
                const max = d.data.reduce(
                    (acc, r) => (r.num > acc ? r.num : acc),
                    0
                );
                setState((ps) => ({
                    ...ps,
                    isLoading: false,
                    me: d.data.me,
                    max,
                    numRatings,
                    average,
                    ratings,
                }));
            })
            .catch((error) => setState((pv) => ({ ...pv, error })));
    }, [props]);

    React.useEffect(() => {
        loadRatings();
    }, [loadRatings]);

    const setRate = (score) => {
        const { planId } = props;
        if (!isAuthenticated)
            return dispatch(openModal({ modalType: "register" }));

        return api
            .post("/rate/", { score, plan_id: planId })
            .then(() => {
                setState((pv) => ({ ...pv, score }));

                return loadRatings();
            })
            .catch((error) => setState((pv) => ({ ...pv, error })));
    };

    const hoverRate = (rate) => {
        setState((pv) => ({ ...pv, tempRate: rate }));
    };
    const { score, tempRate, max, numRatings, average, ratings } = state;
    const displayRate = tempRate || score;

    return (
        <Fragment>
            עד כמה אתם חושבים שהתוכנית מטיבה עם סביבתה?
            <div className="row">
                <div className="col-5 col-12">
                    <Rating
                        direction="rtl"
                        onClick={setRate}
                        onHover={hoverRate}
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
                            <div key={index} className="row">
                                <div className="col-2">{index + 1}</div>
                                <div className="col-10">
                                    <div className="progress">
                                        <div
                                            className="progress-bar bg-warning"
                                            role="progressbar"
                                            aria-valuenow={rating}
                                            style={{
                                                width: `${width}%`,
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
};

Rate.propTypes = {
    planId: PropTypes.number,
};

export default Rate;
