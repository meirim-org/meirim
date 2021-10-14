import { Button } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import { Text } from 'shared';

const SharePlan = () => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const { t } = useTranslation();
	
	return (				
		<Button
			variant="contained"
			color="primary"
			onClick={() => dispatch(openModal({ modalType: 'share' }))}
			startIcon={<ShareIcon />}
		>
			<Text size="14px" text={t.sharing} component="span" color={theme.palette.gray['800']}/>
		</Button>
	);
};

export default SharePlan;