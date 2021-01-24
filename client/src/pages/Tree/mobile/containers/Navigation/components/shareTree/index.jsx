import React from 'react';
import ShareIcon from '@material-ui/icons/Share';
import { openModal } from 'redux/modal/slice';
import { useDispatch } from 'react-redux';
import { BottomNavigationAction } from '@material-ui/core';
import t from 'locale/he_IL';

const ShareTree = () => {
	const dispatch = useDispatch();

	return (
		<BottomNavigationAction
			onClick={() => dispatch(openModal({ modalType: 'shareTree' }))}
			label={t.sharing}
			icon={<ShareIcon fontSize={'small'}/>} />
	);
};

export default ShareTree;
