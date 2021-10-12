import React from 'react';
import PropTypes from 'prop-types';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { Text } from 'shared';
import t from 'locale/he_IL';
import * as SC from './style';
import { colors } from 'style';

const SavePlan = ({ subscriptionHandler, isFavPlan }) => {
	
	return (				
		<SC.Button
			onClick={subscriptionHandler}
			variant="contained" 
			color="primary"
			className={isFavPlan ? 'active' : null}
			startIcon={isFavPlan ? <StarIcon/> :<StarBorderIcon/> }>
			<Text size="14px" text={isFavPlan ? t.saved : t.saving} component="span" color={colors.grey[800]}/>
		</SC.Button>
	);
};

SavePlan.propTypes = {
	subscriptionHandler: PropTypes.func.isRequired,
	isFavPlan: PropTypes.bool.isRequired,
};
export default SavePlan;