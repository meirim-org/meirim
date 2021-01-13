import React from 'react';
import { useTheme } from '@material-ui/styles';
import { StarIcon } from 'shared/icons';
import { Button } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Text } from 'shared';
import { subscribeUserToPlan } from 'pages/Plan/controller';
import t from 'locale/he_IL';
import { useParams } from 'react-router-dom';
import { useIsFavPlan } from 'pages/Plan/hooks';

const SavePlan = () => {
	const { id } = useParams();
	const isFav = useIsFavPlan(id);
	const theme = useTheme();
	
	return (				
		<Button 
			onClick={() => subscribeUserToPlan(id)} 
			variant="contained" 
			disabled={isFav}
			color="primary" 
			startIcon={isFav ? <StarIcon/> : <StarBorderIcon fontSize={'small'}/>}>
			<Text size="14px" text={t.saving} component="span" color={theme.palette.gray['800']}/>
		</Button>
	);
};

export default SavePlan;