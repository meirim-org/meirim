import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import {  Title } from './components';
import { Button } from 'shared';
import * as SC from './style';
import t from 'locale/he_IL';
import { goBack } from 'pages/Plan/utils';
import { BackButton } from 'pages/Plan/common';
import { useHistory } from 'react-router-dom';

const Header = ({ match, handleTabsPanelRef, fixedHeader, isNewCommentOpen }) => {
	const history = useHistory();
	const { planData } = PlanSelectors();
	const { name, countyName } = planData;
	const { commentsCount } = CommentSelectors();

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
							<div>
								<Button text={t.summary} onClick={() => history.push(match.url)}/>
								<Button text={`${t.opinion}${commentsCount}`} onClick={() => history.push(`${match.url}/comments`)}/> 
								<Button text={t.planningInformation}/>
							</div>
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
	openNewCommentView: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	fixedHeader: PropTypes.bool.isRequired,
	handleTabsPanelRef: PropTypes.func.isRequired
};

export default Header;