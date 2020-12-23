import React from 'react';
import PropTypes from 'prop-types';
import { CommentSelectors } from 'redux/selectors';
import { Tabs, Title } from './components';
import * as SC from './style';
import t from 'locale/he_IL';

const Header = ({ countyName, name, tabValue, handleTabChange, isNewCommentOpen }) => {
	const { comments } = CommentSelectors();
	const	numberOfComments = comments.length.toString();
	
	return (
		<SC.Header>
			{!isNewCommentOpen
				?
				<SC.TitlesAndTabs>
					<Title title={countyName} subTitle={name}/>
					<SC.AppBar position="static">
						<Tabs tabValue={tabValue} handleTabChange={handleTabChange} numberOfComments={numberOfComments} />
					</SC.AppBar>
				</SC.TitlesAndTabs>
				:
				<SC.NewCommentTitle>
					<Title subTitle={t.addNewComment}/>
				</SC.NewCommentTitle>
			}
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
};

export default Header;