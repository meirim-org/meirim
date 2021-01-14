import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { StarIcon } from 'shared/icons';
import { Button } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Text } from 'shared';
import t from 'locale/he_IL';

const SavePlan = ({ subscriptionHandler, isFavPlan }) => {
	const theme = useTheme();
	
	return (				
		<Button 
			onClick={subscriptionHandler}
			variant="contained" 
			color="primary" 
			startIcon={isFavPlan ? <StarIcon/> : <StarBorderIcon fontSize={'small'}/>}>
			<Text size="14px" text={t.saving} component="span" color={theme.palette.gray['800']}/>
		</Button>
	);
};

SavePlan.propTypes = {
	subscriptionHandler: PropTypes.func.isRequired,
	isFavPlan: PropTypes.bool.isRequired,
};
export default SavePlan;