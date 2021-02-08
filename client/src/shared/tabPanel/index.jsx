import React from "react";
import PropTypes from "prop-types";

const TabPanel = ({ children, ...props }) => (
    <div role="tabpanel" aria-labelledby={"panel"} {...props}>
        {children}
    </div>
);

TabPanel.propTypes = {
    children: PropTypes.any,
};

export default TabPanel;
