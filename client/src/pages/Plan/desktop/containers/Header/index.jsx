import React from 'react';
import { useHistory } from 'react-router-dom';
import t from 'locale/he_IL';
import PropTypes from 'prop-types';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Button } from 'shared';
import { SavePlan, SharePlan, Title, AddNewComment } from './components';
import * as SC from './style';

const Header = ({ openNewCommentView, match }) => {
	const history = useHistory();
	const { planData: { name, countyName } } = PlanSelectors();
	const { commentsCount } = CommentSelectors();
	
	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<Title countyName={countyName} planName={name}/>
				<SC.AppBar position="static">
					<div>
						<Button text={t.summary} onClick={() => history.push(match.url)}/>
						<Button text={`${t.opinion}${commentsCount}`} onClick={() => history.push(`${match.url}/comments`)}/> 
						<Button text={t.planningInformation}/>
					</div>
				</SC.AppBar>
			</SC.TitlesAndTabs>
			<SC.Buttons>
				<SharePlan />
				<SavePlan />
				<AddNewComment openNewCommentView={openNewCommentView}/>
			</SC.Buttons>
		</SC.Header>
	);
};

Header.propTypes = {
	openNewCommentView: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default Header;