import React from 'react';
import PropTypes from 'prop-types';
import { Menu as MUmenu, MenuItem } from '@material-ui/core';
import { Button } from '../index';

const Menu = ({
	ariaControls,
	openHandler,
	closeHandler,
	text,
	textColor,
	iconBefore,
	iconAfter,
	dropDownEl,
	menuItems
}) => (
	<>
		<Button
			simple
			aria-controls={ariaControls}
			aria-haspopup="true"
			onClick={openHandler}
			text={text}
			fontWeight={400}
			textColor={textColor}
			iconBefore={iconBefore}
			iconAfter={iconAfter}
		/>
		<MUmenu
			id={ariaControls}
			anchorEl={dropDownEl}
			keepMounted
			open={Boolean(dropDownEl)}
			onClose={closeHandler}
		>
			{
				menuItems.map((item, index) => (
					<MenuItem key={index} onClick={item.onClick}>{item.text}</MenuItem>
				))
			}
		</MUmenu>
	</>
);

Menu.propTypes = {
	ariaControls: PropTypes.string.isRequired,
	openHandler: PropTypes.func.isRequired,
	closeHandler: PropTypes.func.isRequired,
	text: PropTypes.string,
	textColor: PropTypes.string,
	iconBefore: PropTypes.node,
	iconAfter: PropTypes.node,
	dropDownEl: PropTypes.object.isRequired,
	menuItems: PropTypes.array.isRequired
};

export default Menu;
