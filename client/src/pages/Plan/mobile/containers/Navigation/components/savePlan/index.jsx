import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from 'shared/icons';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import t from 'locale/he_IL';
import { BottomNavigationAction } from '@material-ui/core';

const SavePlan = ({ subscriptionHandler, isFavPlan }) => {
	
	return (
		<BottomNavigationAction
			onClick={subscriptionHandler}
			label={t.saving}
			icon={isFavPlan ? <StarIcon/> : <StarBorderIcon fontSize={'small'}/>} />
	);
};

SavePlan.propTypes = {
	subscriptionHandler: PropTypes.func.isRequired,
	isFavPlan: PropTypes.bool.isRequired,
};

export default SavePlan;
