import { useTranslation } from 'locale/he_IL';
import { BackButton } from 'pages/Plan/common';
import { goBack } from 'pages/Plan/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { TreeSelectors } from 'redux/selectors';
import { pageTitleText, tabIsActive } from '../../../utils';
import { Title } from './components';
import * as SC from './style';

const Header = ({ match, handleTabsPanelRef, fixedHeader }) => {
	const history = useHistory();
	const { t } = useTranslation();
	const {
		treeData: { place, street, street_number, total_trees },
	} = TreeSelectors();
	const pathData = {
		pathName: history.location.pathname,
		treeId: match.params.id,
	};

	const tabsPanelRef = useRef(null);
	useEffect(() => handleTabsPanelRef(tabsPanelRef));

	const titleText = pageTitleText(total_trees, street, street_number);

	return (
		<SC.Header>
			<SC.HeaderContent>
				<SC.TitlesButtonWrapper>
					<BackButton
						onclick={goBack}
						label={t.backToComments}
						classname="back-button"
					/>
					<Title place={place} text={titleText} />
				</SC.TitlesButtonWrapper>
				<SC.AppBar
					ref={tabsPanelRef}
					position="static"
					className={fixedHeader ? 'fixed' : ''}
				>
					<SC.TabWrapper>
						<SC.Tab
							className={
								tabIsActive('summary', pathData) ? 'active' : ''
							}
							onClick={() => history.push(match.url)}
						>
							{t.summary}
						</SC.Tab>
					</SC.TabWrapper>
				</SC.AppBar>
			</SC.HeaderContent>
		</SC.Header>
	);
};

Header.propTypes = {
	match: PropTypes.object.isRequired,
	fixedHeader: PropTypes.bool.isRequired,
	handleTabsPanelRef: PropTypes.func.isRequired,
};

export default Header;
