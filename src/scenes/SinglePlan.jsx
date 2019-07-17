import React, { Component, Fragment } from "react";
import geojsonArea from "@mapbox/geojson-area";
import { Redirect } from "react-router-dom";
import { Chart } from "react-charts";
import Moment from "react-moment";

import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";

import Wrapper from "../components/Wrapper";
import Comments from "../components/Comments";
import Mapa from "../components/Mapa";
import UnsafeRender from "../components/UnsafeRender";
import LandUseVocabulary from "../components/LandUseVocabulary";

import NotificationImportant from "@material-ui/icons/NotificationImportant";
import CheckCircle from "@material-ui/icons/CheckCircle";
import BarChart from "@material-ui/icons/BarChart";

import Terrain from "@material-ui/icons/Terrain";
import AccountBalance from "@material-ui/icons/AccountBalance";

import api from "../services/api";
import "bootstrap/dist/css/bootstrap.css";

import t from "../locale/he_IL";
import AddComment from "../components/Comments/AddComment";

const axes = [
    { primary: true, type: "ordinal", position: "bottom" },
    { position: "left", type: "linear", stacked: true }
];

const commas = number => number.toLocaleString();
const renderMultiplier = areaObj =>
    commas(
        Math.round(((areaObj.new + areaObj.exist) / areaObj.exist) * 100) / 100
    );

const renderPercent = number => commas(Math.round(number * 100));

const parseNumber = string => {
    string = string.replace(",", "");
    if (parseInt(string)) {
        return parseInt(string.replace(",", ""));
    }
    if (string.charAt(0) === "-") {
        return -parseInt(string.slice(1));
    }
    return 0;
};

const headlineStyle = {
    display: "flex",
    alignItems: "center"
};
class SinglePlan extends Component {
    state = {
        plan: {}
    };

    componentDidMount() {
        const { id } = this.props.match.params;
        return api
            .get("/plan/" + id)
            .then(plan => this.setState({ plan: plan.data }))
            .catch(error => {
                this.setState({ error });
            });
    }

    render() {
        const { plan, error } = this.state;
        const { me, match } = this.props;
        const { id } = match.params;

        if (error && error.status === 404) {
            return <Redirect to="/404" />;
        }

        if (!plan.PL_NAME) {
            return <Wrapper me={me}>Loading</Wrapper>;
        }

        const textArea = {
            exist: 0,
            new: 0,
            area: plan.geom ? Math.round(geojsonArea.geometry(plan.geom)) : 0
        };

        const changes =
            plan && plan.areaChanges ? JSON.parse(plan.areaChanges) : null;

        changes &&
            changes[0].map((change, i) => {
                if (change[3].includes('מ"ר')) {
                    textArea.exist += parseNumber(change[5]);
                    textArea.new += parseNumber(change[6]);
                }
            });
        return (
            <Wrapper me={me}>
                <div className="container" className="container">
                    <Breadcrumbs aria-label="Breadcrumb" separator="›">
                        <Link color="inherit" href="/plans/">
                            תוכניות
                        </Link>
                        <Link color="inherit">
                            {plan.data.PLAN_COUNTY_NAME}
                        </Link>
                    </Breadcrumbs>
                    <div className="row">
                        <div className="col-md-5">
                            <div
                                className="map-container"
                                style={{ height: "300px" }}
                            >
                                <Mapa geom={plan.geom} />
                            </div>
                            <Paper className="hidden-sm-down">
                                <h5>מה דעתך על התוכנית?</h5>
                                <AddComment me={me} />
                            </Paper>
                        </div>
                        <div className="col-md-7 order-md-first">
                            <h1>{plan.PL_NAME}</h1>
                            <p>
                                <UnsafeRender html={plan.goals_from_mavat} />
                            </p>

                            <p>
                                {/* {!textArea.new && (
                                    <Fragment>
                                        <CheckCircle />
                                        תוכנית זו אינה משנה את נפח הבניה או שלא
                                        הצלחנו לקרוא את הפרטים
                                    </Fragment>
                                )} */}
                                {!!textArea.new && (
                                    <Fragment>
                                        {textArea.new > 0 && (
                                            <div style={headlineStyle}>
                                                <NotificationImportant color="action" />
                                                תוכנית זו מגדילה את השטח הבנוי
                                            </div>
                                        )}
                                        {textArea.new < 0 && (
                                            <div style={headlineStyle}>
                                                <NotificationImportant color="action" />
                                                תוכנית זו מקטינה את השטח הבנוי
                                            </div>
                                        )}
                                        <ul>
                                            <li>
                                                {commas(
                                                    textArea.exist +
                                                        textArea.new
                                                )}{" "}
                                                מ"ר במקום{" "}
                                                {commas(textArea.exist)} מ"ר (
                                                {renderPercent(
                                                    renderMultiplier(textArea)
                                                )}
                                                {"% "})
                                            </li>
                                            <li>
                                                {renderPercent(
                                                    (textArea.new +
                                                        textArea.exist) /
                                                        textArea.area
                                                )}
                                                % אחוזי בניה במקום{" "}
                                                {renderPercent(
                                                    textArea.exist /
                                                        textArea.area
                                                )}
                                                %.
                                            </li>
                                        </ul>
                                    </Fragment>
                                )}
                            </p>
                            <p>
                                <div style={headlineStyle}>
                                    <Terrain color="action" />
                                    שימושי קרקע מוצעים בתוכנית{" "}
                                </div>
                                <LandUseVocabulary
                                    landUseJoined={plan.data.PL_LANDUSE_STRING}
                                />
                            </p>
                            <p>
                                <div style={headlineStyle}>
                                    <AccountBalance color="action" />
                                    מצב סטטוטורי
                                </div>
                                <ul>
                                    <li>
                                        סוג תוכנית:{" "}
                                        {plan.data.ENTITY_SUBTYPE_DESC}
                                    </li>
                                    {plan.jurisdiction && (
                                        <li>
                                            מוסד התכנון: וועדה{" "}
                                            {plan.jurisdiction}
                                        </li>
                                    )}
                                    {plan.data.DEPOSITING_DATE && (
                                        <li>
                                            תאריך הפקדה:{" "}
                                            <Moment format="DD/MM/YYYY">
                                                {plan.data.DEPOSITING_DATE}
                                            </Moment>
                                        </li>
                                    )}

                                    <li>סטטוס: {plan.data.STATION_DESC}</li>
                                </ul>
                            </p>
                            <hr />
                            <Infographics plan={plan} />
                            <hr />
                            <h4>תיאור התוכנית</h4>
                            <div style={{ margin: 40 }}>
                                <UnsafeRender
                                    html={plan.main_details_from_mavat}
                                />
                            </div>
                            <hr />
                            <h4>תגובות</h4>
                            <Comments planId={id} me={me} />
                            <hr />
                            <h4>פרטים נוספים</h4>
                            <ul>
                                <li>מספר תוכנית: {plan.data.PL_NUMBER}</li>

                                <li>
                                    עדכון אחרון:{" "}
                                    <Moment
                                        parse="YYYYMMDDHHmm"
                                        format="DD/MM/YYYY"
                                    >
                                        {plan.data.LAST_UPDATE}
                                    </Moment>
                                </li>
                                <li>
                                    <a target="_blank" href={plan.plan_url}>
                                        מסמכי התוכנית באתר משרד האוצר
                                    </a>
                                </li>
                            </ul>
                            {plan.notCredible && (
                                <div className="note">
                                    שימו לב! זוהי תכנית המופקדת בסמכות מקומית.
                                    מכיוון שהוועדות המקומיות לא מדווחות בצורה
                                    אחידה אודות הסטטוס של התכניות בסמכותן אנחנו
                                    ממליצים לא להסתמך על סטטוס התכניות (גם לא
                                    כמו שמופיע באתר "תכנון זמין"). התכנית עברה
                                    "תנאי סף" וכנראה שהיא בהפקדה או תכף מופקדת
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

const Infographics = function({ plan }) {
    if (!plan) {
        return null;
    }
    const changes =
        plan && plan.areaChanges ? JSON.parse(plan.areaChanges) : null;

    const series = { type: "bar" };

    const dataArea = [
        {
            label: "זכויות קיימות",
            data: []
        },
        {
            label: "זכויות מבוקשות",
            data: []
        }
    ];

    const dataUnits = [
        {
            label: "יחידות קיימות",
            data: []
        },
        {
            label: "יחידות מבוקשות",
            data: []
        }
    ];

    changes &&
        changes[0].map((change, i) => {
            if (change[3].includes('מ"ר')) {
                dataArea[0].data.push({
                    x: change[3],
                    y: parseNumber(change[5])
                });
                dataArea[1].data.push({
                    x: change[3],
                    y: parseNumber(change[6])
                });
            } else {
                dataUnits[0].data.push({
                    x: change[3],
                    y: parseNumber(change[5])
                });
                dataUnits[1].data.push({
                    x: change[3],
                    y: parseNumber(change[6])
                });
            }
        });
    console.log(dataArea);
    // <Card raised={true} style={{ padding: 10 }}>
    return (
        <div className="row">
            {!!dataArea && !!dataArea[0].data.length && (
                <div className="col-sm-8">
                    <h6 style={headlineStyle}>
                        <BarChart color="action" /> שינוי שטח
                    </h6>
                    <div style={{ height: 200 }}>
                        <Chart
                            series={series}
                            data={dataArea}
                            axes={axes}
                            tooltip={true}
                        />
                    </div>
                </div>
            )}
            {!!dataUnits && !!dataUnits[0].data.length && (
                <div className="col-sm-4">
                    <h6 style={headlineStyle}>
                        <BarChart color="action" />
                        שינוי יחידות דיור
                    </h6>
                    <div style={{ height: 200 }}>
                        <Chart
                            series={series}
                            data={dataUnits}
                            axes={axes}
                            tooltip={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
export default SinglePlan;
