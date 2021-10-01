import React from 'react';
import ShareIcon from '@material-ui/icons/Share';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { Text } from 'shared';
import t from 'locale/he_IL';
import { colors } from 'style';

const ShareTree = () => {
	const dispatch = useDispatch();

	return (				
		<Button
			variant="contained"
			color="primary"
			onClick={() => dispatch(openModal({ modalType: 'shareTree' }))}
			startIcon={<ShareIcon />}
		>
			<Text size="14px" text={t.sharing} component="span" color={colors.grey[800]}/>
		</Button>
	);
};

export default ShareTree;