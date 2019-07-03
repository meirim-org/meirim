import React, { Component, Fragment } from "react";
import geojsonArea from "@mapbox/geojson-area";
import { Redirect } from "react-router-dom";
import { Chart } from "react-charts";

import Wrapper from "../components/Wrapper";
import Comments from "../components/Comments";
import Mapa from "../components/Mapa";
import UnsafeRender from "../components/UnsafeRender";

import api from "../services/api";
import "../assets/bootstrap.css";

import Moment from "react-moment";

import t from "../locale/he_IL";

const axes = [
    { primary: true, type: "ordinal", position: "bottom" },
    { position: "left", type: "linear", stacked: true }
];

const renderMultiplier = areaObj =>
    Math.round(((areaObj.new + areaObj.exist) / areaObj.exist) * 100) / 100;

const renderPercent = number => Math.round(number * 100);

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

        const changes =
            plan && plan.areaChanges ? JSON.parse(plan.areaChanges) : null;

        const series = { type: "bar" };

        const textArea = {
            exist: 0,
            new: 0,
            area: plan.geom ? Math.round(geojsonArea.geometry(plan.geom)) : 0
        };

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

                    textArea.exist += parseNumber(change[5]);
                    textArea.new += parseNumber(change[6]);
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

        console.log(Comments);
        return (
            <Wrapper me={me}>
                {plan.PL_NAME && (
                    <div className="container" className="container">
                        <div className="container">
                            <h1>{plan.PL_NAME}</h1>
                            <div className="row">
                                <div className="col">
                                    <div className="empty_rectangle">
                                        <h4>מטרות התוכנית</h4>
                                        <UnsafeRender
                                            html={plan.goals_from_mavat}
                                        />
                                    </div>
                                    <div className="empty_rectangle">
                                        <h4>תיאור התוכנית</h4>
                                        <UnsafeRender
                                            html={plan.main_details_from_mavat}
                                        />
                                    </div>
                                    <div className="rectangle">
                                        <h4>תגובות</h4>
                                        <div id="comments" />
                                        <Comments planId={id} />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="rectangle">
                                        <h4>מיקום</h4>
                                        <div
                                            className="map-container"
                                            style={{ height: "300px" }}
                                        >
                                            <Mapa geom={plan.geom} />
                                        </div>
                                    </div>
                                    {!!dataArea && !!dataArea[0].data.length && (
                                        <div className="rectangle">
                                            <h4>שינוי שטח</h4>
                                            <p>
                                                תוכנית זו מגדילה את השטח הבנוי
                                                פי {renderMultiplier(textArea)}{" "}
                                                (תוספת {textArea.new} מ"ר)
                                            </p>
                                            <p>
                                                {renderPercent(
                                                    (textArea.new +
                                                        textArea.exist) /
                                                        textArea.area
                                                )}
                                                % בניה (במקום{" "}
                                                {renderPercent(
                                                    textArea.exist /
                                                        textArea.area
                                                )}
                                                % )
                                            </p>
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
                                        <div className="rectangle">
                                            <h4>שינוי יחידות דיור</h4>
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

                                    <div className="rectangle">
                                        <h4>נתוני התוכנית</h4>
                                        <ul>
                                            <li>
                                                מספר תוכנית:{" "}
                                                {plan.data.PL_NUMBER}
                                            </li>
                                            <li>
                                                סוג תוכנית:{" "}
                                                {plan.data.ENTITY_SUBTYPE_DESC}
                                            </li>
                                            {plan.jurisdiction && (
                                                <li>
                                                    מוסד התכנון המוסמך להפקיד את
                                                    התכנית: {plan.jurisdiction}
                                                </li>
                                            )}
                                            <li>
                                                תאריך הפקדה:{" "}
                                                <Moment format="DD/MM/YYYY">
                                                    {plan.data.DEPOSITING_DATE}
                                                </Moment>
                                            </li>
                                            <li>
                                                שימוש קרקע:{" "}
                                                {plan.data.PL_LANDUSE_STRING}
                                            </li>
                                            <li>
                                                סטטוס: {plan.data.STATION_DESC}
                                            </li>
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
                                                <a
                                                    target="_blank"
                                                    href={plan.plan_url}
                                                >
                                                    מסמכי התוכנית באתר משרד
                                                    האוצר
                                                </a>
                                            </li>
                                        </ul>
                                        {plan.notCredible && (
                                            <div className="note">
                                                שימו לב! זוהי תכנית המופקדת
                                                בסמכות מקומית. מכיוון שהוועדות
                                                המקומיות לא מדווחות בצורה אחידה
                                                אודות הסטטוס של התכניות בסמכותן
                                                אנחנו ממליצים לא להסתמך על סטטוס
                                                התכניות (גם לא כמו שמופיע באתר
                                                "תכנון זמין"). התכנית עברה "תנאי
                                                סף" וכנראה שהיא בהפקדה או תכף
                                                מופקדת
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Wrapper>
        );
    }
}

export default SinglePlan;
