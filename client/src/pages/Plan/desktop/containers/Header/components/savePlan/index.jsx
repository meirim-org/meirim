import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'shared';
import * as SC from './style';

const SavePlan = ({ subscriptionHandler, isFavPlan }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	return (				
		<SC.Button
			onClick={subscriptionHandler}
			variant="contained" 
			color="primary"
			className={isFavPlan ? 'active' : null}
			startIcon={isFavPlan ? <StarIcon/> :<StarBorderIcon/> }>
			<Text size="14px" text={isFavPlan ? t.saved : t.saving} component="span" color={theme.palette.gray['800']}/>
		</SC.Button>
	);
};

SavePlan.propTypes = {
	subscriptionHandler: PropTypes.func.isRequired,
	isFavPlan: PropTypes.bool.isRequired,
};
export default SavePlan;