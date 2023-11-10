import React from 'react';
import { Button } from 'shared';
import { DiamondIconWhite, DiamondIcon } from './Icons';
import PropTypes from 'prop-types';

const UpgradeButton = ({
	variant,
	onClick,
	text = 'upgrade',
	showIcon = true,
}) => {
	if (variant === 'button') {
		return (
			<Button
				text={text}
				fontSize="18px"
				fontWeight="600"
				padding="12px 20px"
				small
				borderradius="8px"
				iconAfter={showIcon && <DiamondIconWhite />}
				lineheight="24px"
				onClick={onClick}
			/>
		);
	}

	if (variant === 'string') {
		return (
			<Button
				text={text}
				fontSize="16px"
				fontWeight="600"
				padding="0"
				iconAfter={showIcon && <DiamondIcon />}
				lineheight="24px"
				removebackground="true"
				minheight="auto"
				border="none"
				textcolor="#652DD0"
				onClick={onClick}
				simple={true}
			/>
		);
	}

	return null;
};

UpgradeButton.propTypes = {
	variant: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	text: PropTypes.string,
	showIcon: PropTypes.bool,
};

export default UpgradeButton;
