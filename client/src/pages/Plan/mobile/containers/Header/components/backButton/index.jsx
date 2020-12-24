import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PropTypes from 'prop-types';

const BackButton = ({ onclick, classname, label }) => {
	return (
		<IconButton onClick={onclick} className={classname} aria-label={label}>
			<ArrowForwardIcon />
		</IconButton>
	);
};

BackButton.propTypes = {
	classname: PropTypes.string,
	label: PropTypes.string.isRequired,
	onclick: PropTypes.func,
};


export default BackButton;