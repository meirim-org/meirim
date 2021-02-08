import React from "react";
import PropTypes from "prop-types";
import { Menu as MUmenu, MenuItem, Button } from "@material-ui/core";
// import { Button } from '../index';

const Menu = ({
    ariaControls,
    openHandler,
    closeHandler,
    text,
    iconAfter,
    dropDownEl,
    menuItems,
}) => (
    <>
        <Button
            aria-controls={ariaControls}
            aria-haspopup="true"
            onClick={openHandler}
            endIcon={iconAfter}
        >
            {text}
        </Button>
        <MUmenu
            id={ariaControls}
            anchorEl={dropDownEl}
            keepMounted
            open={Boolean(dropDownEl)}
            onClose={closeHandler}
        >
            {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={item.onClick}>
                    {item.text}
                </MenuItem>
            ))}
        </MUmenu>
    </>
);

Menu.propTypes = {
    ariaControls: PropTypes.string.isRequired,
    openHandler: PropTypes.func.isRequired,
    closeHandler: PropTypes.func.isRequired,
    text: PropTypes.string,
    textcolor: PropTypes.string,
    iconBefore: PropTypes.node,
    iconAfter: PropTypes.node,
    dropDownEl: PropTypes.object,
    menuItems: PropTypes.array.isRequired,
};

export default Menu;
