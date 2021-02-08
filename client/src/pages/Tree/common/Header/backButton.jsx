import React from "react";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import * as SC from "./style";

const BackButton = ({ onclick, classname, label }) => {
    return (
        <IconButton onClick={onclick} className={classname} aria-label={label}>
            <SC.ArrowIcon />
        </IconButton>
    );
};

BackButton.propTypes = {
    classname: PropTypes.string,
    label: PropTypes.string.isRequired,
    onclick: PropTypes.func,
};

export default BackButton;
