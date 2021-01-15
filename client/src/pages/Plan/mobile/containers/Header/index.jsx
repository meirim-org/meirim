import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Title } from './components';
import * as SC from './style';
import t from 'locale/he_IL';
import { goBack } from 'pages/Plan/utils';
import { BackButton } from 'pages/Plan/common';
import { useHistory } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import { tabIsActive } from 'utils';

const Header = ({ match, handleTabsPanelRef, fixedHeader, isNewCommentOpen, setCommentState }) => {
	const history = useHistory();
	const { planData } = PlanSelectors();
	const { name, countyName } = planData;
	const { commentsCount } = CommentSelectors();
	const pathData  = {
		pathName: history.location.pathname,
		planId: match.params.id
	};

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
							<SC.TabWrapper>
								<SC.Tab className={tabIsActive('summary',pathData) ? 'active' : ''}
									onClick={() => history.push(match.url)}>{t.summary}</SC.Tab>
								<SC.Tab className={tabIsActive('comments',pathData) ? 'active' : ''}
									onClick={() => history.push(`${match.url}/comments`)}>
									<Badge badgeContent={commentsCount} color="primary">
										{t.opinion}
									</Badge>
								</SC.Tab>
								<SC.Tab className={tabIsActive('info',pathData) ? 'active' : ''}
									onClick={() => history.push(`${match.url}/info`)}>{t.planningInformation}</SC.Tab>
							</SC.TabWrapper>
						</SC.AppBar>
					</>
					:
					<SC.TitlesButtonWrapper>
						<BackButton onclick={() => {
							setCommentState(pv =>({ ...pv, isOpen: false }));}
						} 
						label={t.backToComments} classname="back-button"/>
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
	handleTabsPanelRef: PropTypes.func.isRequired,
	setCommentState: PropTypes.func.isRequired,
};

export default Header;