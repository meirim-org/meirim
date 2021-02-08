import React from "react";
import PropTypes from "prop-types";
import MUIDivider from "@material-ui/core/Divider";

const Divider = ({ orientation }) => (
    <MUIDivider
        orientation={orientation}
        flexItem={true}
        variant="fullWidth"
    ></MUIDivider>
);

Divider.defaultProps = {
    orientation: "vertical",
};

Divider.propTypes = {
    orientation: PropTypes.string,
};

export default Divider;
