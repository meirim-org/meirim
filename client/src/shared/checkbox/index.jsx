import React from "react";
import PropTypes from "prop-types";
import MUICheckbox from "@material-ui/core/Checkbox";
import HelperText from "../helperText";
import styled from "styled-components";

const StyledCheckbox = styled(MUICheckbox)`
    font-stretch: normal;
    letter-spacing: normal;
    text-align: center;
    float: right;
    color: #ffffff;
    .MuiButton-label {
        font-family: Assistant !important;
    }
    &:focus {
        outline: none;
    }
`;

const Checkbox = ({ text, id, checked, onClick, error, small = false }) => {
    const minHegiht = small ? "1em" : "3.7em";

    return (
        <>
            <StyledCheckbox
                id={id}
                checked={checked}
                size="medium"
                minhegiht={minHegiht}
                onClick={onClick}
                variant="contained"
                color="primary"
            >
                {text}
            </StyledCheckbox>
            {error && (
                <HelperText text={text} id={`${id}-helperText`} error={error} />
            )}
        </>
    );
};

Checkbox.defaultProps = {
    small: false,
};

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    small: PropTypes.bool,
    error: PropTypes.string,
};

export default Checkbox;
