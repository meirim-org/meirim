import React from "react";
import * as SC from "./style";
import { AddNewComment, SavePlan, SharePlan } from "./components";
import PropTypes from "prop-types";

const Navigation = ({
    newCommentViewHandler,
    subscriptionHandler,
    isFavPlan,
}) => {
    return (
        <SC.Navigation>
            <SharePlan />
            <AddNewComment newCommentViewHandler={newCommentViewHandler} />
            <SavePlan
                subscriptionHandler={subscriptionHandler}
                isFavPlan={isFavPlan}
            />
        </SC.Navigation>
    );
};

Navigation.propTypes = {
    subscriptionHandler: PropTypes.func.isRequired,
    isFavPlan: PropTypes.bool.isRequired,
    newCommentViewHandler: PropTypes.func.isRequired,
};

export default Navigation;
