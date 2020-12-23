import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import t from 'locale/he_IL';

const BackButton = () => {

	return (
		<IconButton aria-label={t.backToComments}>
			<ArrowForwardIcon />
		</IconButton>
	);
};


export default BackButton;