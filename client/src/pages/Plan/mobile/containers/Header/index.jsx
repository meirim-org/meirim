import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Tabs, Title } from './components';
import * as SC from './style';
import t from 'locale/he_IL';
import { goBack } from 'pages/Plan/utils';
import { BackButton } from 'pages/Plan/common';

const Header = ({ handleTabsPanelRef, fixedHeader, tabValue, handleTabChange, isNewCommentOpen, commentsCount }) => {
	const { planData } = PlanSelectors();
	const { name, countyName } = planData;

	const tabsPanelRef = useRef(null);
	useEffect(() => handleTabsPanelRef(tabsPanelRef));

	return (
		<SC.Header className={isNewCommentOpen ? 'low' : ''}>
			<SC.HeaderContent>
				{!isNewCommentOpen
					?
					<>
						<SC.TitlesButtonWrapper>
							<BackButton onclick={goBack} label={t.backToComments} classname="back-button"/>
					    	<Title title={countyName} subTitle={name}/>
						</SC.TitlesButtonWrapper>
						<SC.AppBar ref={tabsPanelRef} position="static" className={fixedHeader ? 'fixed' : ''}>
							<Tabs tabValue={tabValue} handleTabChange={handleTabChange} commentsCount={commentsCount} />
						</SC.AppBar>
					</>
					:
					<SC.TitlesButtonWrapper>
						<BackButton label={t.backToComments} classname="back-button"/>
						<Title subTitle={t.addNewComment}/>
					</SC.TitlesButtonWrapper>
				}
			</SC.HeaderContent>
		</SC.Header>
	);
};

Header.propTypes = {
	name: PropTypes.string,
	countyName: PropTypes.string,
	tabValue: PropTypes.any.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	fixedHeader: PropTypes.bool.isRequired,
	handleTabsPanelRef: PropTypes.func.isRequired,
    commentsCount: PropTypes.string.isRequired,
};

export default Header;