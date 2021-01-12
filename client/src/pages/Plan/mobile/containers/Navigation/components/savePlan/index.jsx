import React from 'react';
import { StarIcon } from 'shared/icons';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import t from 'locale/he_IL';
import { subscribeUserToPlan } from 'pages/Plan/controller';
import { BottomNavigationAction } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useIsFavPlan } from 'pages/Plan/hooks';

const SavePlan = () => {
	const { id } = useParams();
	const isFav = useIsFavPlan(id);
	
	return (
		<BottomNavigationAction
			onClick={() => subscribeUserToPlan(id)}
			label={t.saving}
			disabled={isFav}
			icon={isFav ? <StarIcon/> : <StarBorderIcon fontSize={'small'}/>} />
	);
};

export default SavePlan;
