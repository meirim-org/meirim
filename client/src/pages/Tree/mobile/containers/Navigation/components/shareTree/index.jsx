import { BottomNavigationAction } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { useTranslation } from 'locale/he_IL';
import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';

const ShareTree = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	return (
		<BottomNavigationAction
			onClick={() => dispatch(openModal({ modalType: 'shareTree' }))}
			label={t.sharing}
			icon={<ShareIcon fontSize={'small'}/>} />
	);
};

export default ShareTree;
