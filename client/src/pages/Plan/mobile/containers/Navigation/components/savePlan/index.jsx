import React from 'react';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import t from 'locale/he_IL';
import { subscribeUserToPlan } from 'pages/Plan/controller';
import { BottomNavigationAction } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const SavePlan = () => {
	const { id } = useParams();

	return (
		<BottomNavigationAction
			onClick={() => subscribeUserToPlan(id)}
			label={t.saving}
			icon={<StarBorderIcon fontSize={'small'}/>} />
	);
};

export default SavePlan;
