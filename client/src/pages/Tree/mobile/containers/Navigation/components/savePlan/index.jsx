import React from 'react';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import t from 'locale/he_IL';
import { BottomNavigationAction } from '@material-ui/core';

const SavePlan = () => {
	
	return (
		<BottomNavigationAction
			onClick={() => alert('This feature will be developed')}
			label={t.saving}
			icon={<StarBorderIcon fontSize={'small'}/>} />
	);
};

export default SavePlan;
