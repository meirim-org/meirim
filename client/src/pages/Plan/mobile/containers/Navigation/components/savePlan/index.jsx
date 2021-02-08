import React from "react";
import PropTypes from "prop-types";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import t from "locale/he_IL";
import { BottomNavigationAction } from "@material-ui/core";

const SavePlan = ({ subscriptionHandler, isFavPlan }) => {
    return (
        <BottomNavigationAction
            onClick={subscriptionHandler}
            label={isFavPlan ? t.saved : t.saving}
            icon={isFavPlan ? <StarIcon /> : <StarBorderIcon />}
        />
    );
};

SavePlan.propTypes = {
    subscriptionHandler: PropTypes.func.isRequired,
    isFavPlan: PropTypes.bool.isRequired,
};

export default SavePlan;
