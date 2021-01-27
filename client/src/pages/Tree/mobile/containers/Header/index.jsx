import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TreeSelectors } from 'redux/selectors';
import {  Title } from './components';
import * as SC from './style';
import t from 'locale/he_IL';
import { goBack } from 'pages/Plan/utils';
import { BackButton } from 'pages/Plan/common';
import { useHistory } from 'react-router-dom';
import { tabIsActive, pageTitleText } from '../../../utils';

const Header = ({ match, handleTabsPanelRef, fixedHeader }) => {
	const history = useHistory();
	const { treeData: { place, street , street_number, total_trees } } = TreeSelectors();
	const pathData  = {
		pathName: history.location.pathname,
		treeId: match.params.id
	};

	const tabsPanelRef = useRef(null);
	useEffect(() => handleTabsPanelRef(tabsPanelRef));

	const titleText = pageTitleText(total_trees, street, street_number);

	return (
		<SC.Header>
			<SC.HeaderContent>
				<SC.TitlesButtonWrapper>
					<BackButton onclick={goBack} label={t.backToComments} classname="back-button"/>
					<Title place={place} text={titleText}/>
				</SC.TitlesButtonWrapper>
				<SC.AppBar ref={tabsPanelRef} position="static" className={fixedHeader ? 'fixed' : ''}>
					<SC.TabWrapper>
						<SC.Tab className={tabIsActive('summary',pathData) ? 'active' : ''}
							onClick={() => history.push(match.url)}>{t.summary}</SC.Tab>
					</SC.TabWrapper>
				</SC.AppBar>
			</SC.HeaderContent>
		</SC.Header>
	);
};

Header.propTypes = {
	match: PropTypes.object.isRequired,
	fixedHeader: PropTypes.bool.isRequired,
	handleTabsPanelRef: PropTypes.func.isRequired
};

export default Header;
