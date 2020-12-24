import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'components/Wrapper';
import { CommentSelectors, PlanSelectors } from 'redux/selectors';
import { Header, Navigation, SummaryTab, CommentsTab } from './containers';
import * as SC from './style';
import classnames from 'classnames';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';


const PlanMobile = ({
	tabValue, handleTabChange,
	setRefetchComments,
	isNewCommentOpen,
	newCommentViewHandler,
	openNewCommentView,
	closeNewCommentView,
	subscribePanel, handleSubscribePanel,
	commentTypes,    
	newCommentText, handleNewCommentText,
	newCommentType, handleNewCommentType }) => {
	const [tabsPanelRef, setTabsPanelRef] = React.useState(null);
	const [fixedHeader, setFixedHeader] = React.useState(false);

	const { planData, dataArea, textArea } = PlanSelectors();
	const { comments } = CommentSelectors();
	const { name, countyName } = planData;
	const isPlanHaveComments = comments.length > 0;
	let tabsPanelTop = tabsPanelRef ? tabsPanelRef.current.getBoundingClientRect().top : null;

	const handleTabsPanelRef = (ref) => setTabsPanelRef(ref);
	const handleFixedHeader = (newValue) => setFixedHeader(newValue);

	const mainClasses = classnames({
		'no-comments': !isPlanHaveComments,
		'new-comment': isNewCommentOpen
	});

	// eslint-disable-next-line no-unused-vars
	useScrollPosition(({ prevPos, currPos }) => {
	    if (currPos.y < -Math.abs(tabsPanelTop)) return  handleFixedHeader(true);
		
		return  handleFixedHeader(false);
	},[tabsPanelRef]);

	return (
		<Wrapper>
			<SC.MobileMainWrapper>
				<SC.Content>
					<Header
						handleTabsPanelRef={handleTabsPanelRef}
						fixedHeader={fixedHeader}
						tabValue={tabValue}
						handleTabChange={handleTabChange}
						openNewCommentView={openNewCommentView}
						isNewCommentOpen={isNewCommentOpen}
						name={name}
						countyName={countyName}
					/>
					<SC.Main className={mainClasses}>
						<SummaryTab
							handleSubscribePanel={handleSubscribePanel}
							dataArea={dataArea} textArea={textArea}
							tabValue={tabValue} subscribePanel={subscribePanel}
							planData={planData} />
						<CommentsTab
							setRefetchComments={setRefetchComments}
							tabValue={tabValue}
							isNewCommentOpen={isNewCommentOpen}
							newCommentViewHandler={newCommentViewHandler}
							closeNewCommentView={closeNewCommentView}
							commentTypes={commentTypes}
							newCommentText={newCommentText} handleNewCommentText={handleNewCommentText}
							newCommentType={newCommentType} handleNewCommentType={handleNewCommentType}/>
					</SC.Main>
					<Navigation
						handleTabChange={handleTabChange}
						openNewCommentView={openNewCommentView}
					/>
				</SC.Content>
			</SC.MobileMainWrapper>
		</Wrapper>
	);
};

PlanMobile.propTypes = {
	tabValue: PropTypes.any.isRequired,
	newCommentViewHandler: PropTypes.func.isRequired,
	openNewCommentView: PropTypes.func.isRequired,
	closeNewCommentView: PropTypes.func.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	subscribePanel: PropTypes.bool.isRequired,
	handleSubscribePanel: PropTypes.func.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	commentTypes: PropTypes.array.isRequired,
	newCommentText: PropTypes.string,
	handleNewCommentText: PropTypes.func.isRequired,
	newCommentType: PropTypes.string,
	handleNewCommentType: PropTypes.func.isRequired,
	setRefetchComments: PropTypes.func.isRequired,
};

export default PlanMobile;