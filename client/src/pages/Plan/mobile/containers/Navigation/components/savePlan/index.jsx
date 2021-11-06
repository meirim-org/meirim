import { BottomNavigationAction } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';

const SavePlan = ({ subscriptionHandler, isFavPlan }) => {
	const { t } = useTranslation();

	return (
		<BottomNavigationAction
			onClick={subscriptionHandler}
			label={isFavPlan ? t.saved : t.saving}
			icon={isFavPlan ? <StarIcon/> :<StarBorderIcon/> } />
	);
};

SavePlan.propTypes = {
	subscriptionHandler: PropTypes.func.isRequired,
	isFavPlan: PropTypes.bool.isRequired,
};

export default SavePlan;
