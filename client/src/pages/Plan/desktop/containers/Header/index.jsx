import { Badge } from '@material-ui/core';
import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { tabIsActive } from 'utils';
import { AddNewComment, SavePlan, SharePlan, Title } from './components';
import * as SC from './style';

const Header = ({
	isFavPlan,
	subscriptionHandler,
	match,
	newCommentViewHandler,
}) => {
	const history = useHistory();
	const { t } = useTranslation();
	const {
		planData: { name, countyName },
	} = PlanSelectors();
	const { commentsCount } = CommentSelectors();
	const pathData = {
		pathName: history.location.pathname,
		planId: match.params.id,
	};

	return (
		<SC.Header>
			<SC.TitlesAndTabs>
				<Title countyName={countyName} planName={name} />
				<SC.AppBar position="static">
					<div>
						<SC.Tab
							className={
								tabIsActive('summary', pathData) ? 'active' : ''
							}
							onClick={() => history.push(match.url)}
						>
							{t.summary}
						</SC.Tab>
						<SC.Tab
							className={
								tabIsActive('comments', pathData)
									? 'active'
									: ''
							}
							onClick={() =>
								history.push(`${match.url}/comments`)
							}
						>
							<Badge badgeContent={commentsCount} color="primary">
								{t.opinion}
							</Badge>
						</SC.Tab>
						<SC.Tab
							className={
								tabIsActive('info', pathData) ? 'active' : ''
							}
							onClick={() => history.push(`${match.url}/info`)}
						>
							{t.planningInformation}
						</SC.Tab>
					</div>
				</SC.AppBar>
			</SC.TitlesAndTabs>
			<SC.Buttons>
				<SharePlan />
				<SavePlan
					isFavPlan={isFavPlan}
					subscriptionHandler={subscriptionHandler}
				/>
				<AddNewComment newCommentViewHandler={newCommentViewHandler} />
			</SC.Buttons>
		</SC.Header>
	);
};

Header.propTypes = {
	subscriptionHandler: PropTypes.func.isRequired,
	newCommentViewHandler: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	isFavPlan: PropTypes.bool.isRequired,
};

export default Header;
