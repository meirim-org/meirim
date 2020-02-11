import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./PlanPanel.css";

class PlanPanel extends Component {
    state = {
    };

    componentDidMount() {
    }

    loadRatings = () => {
        const { planId } = this.props;
    };

    render() {
        const {
            planId
        } = this.state;
        
        return (
            <Fragment>
                <div>Test for plan panel</div>
            </Fragment>
        );
    }
}

PlanPanel.propTypes = {
    planId: PropTypes.number,
    me: PropTypes.object
};

export default PlanPanel;
