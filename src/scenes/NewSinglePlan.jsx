import React, { Component, Fragment } from "react";
import geojsonArea from "@mapbox/geojson-area";
import { Redirect } from "react-router-dom";
import { Chart } from "react-charts";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Wrapper from "../components/Wrapper";
import Comments from "../components/Comments";
import Rate from "../components/Rate";

import Mapa from "../components/Mapa";
import UnsafeRender from "../components/UnsafeRender";
import LandUseVocabulary from "../components/LandUseVocabulary";
import PlanPanel from "../components/PlanPanel"

import api from "../services/api";
import "../assets/bootstrap.css";

import t from "../locale/he_IL";
import "./NewSinglePlan.css";

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

        return (
            <Wrapper me={me}>
                <PlanPanel me={me} planId={id}/>
            </Wrapper>
        );
    }
}

export default SinglePlan;
