import React from 'react';
import { useHistory } from 'react-router-dom';
import t from 'locale/he_IL';
import PropTypes from 'prop-types';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { SavePlan, SharePlan, Title, AddNewComment } from './components';
import * as SC from './style';
import { Badge } from '@material-ui/core';

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
						<SC.Tab className="active" onClick={() => history.push(match.url)}>{t.summary}</SC.Tab>
						<SC.Tab onClick={() => history.push(`${match.url}/comments`)}>
							<Badge badgeContent={commentsCount} color="primary">
								{t.opinion}
							</Badge>
						</SC.Tab>
						<SC.Tab>{t.planningInformation}</SC.Tab>
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
	handleTabChange: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
};

export default Header;