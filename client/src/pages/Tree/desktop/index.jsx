import React from 'react';
import PropTypes from 'prop-types';
import Mapa from 'components/Mapa';
import Wrapper from 'components/Wrapper';
import { TreeSelectors } from 'redux/selectors';
import { Header } from './containers';
import Footer from 'components/Footer';
import * as SC from './style';

const Template = ({ 
	// setCommentState,
	handleTabChange,
	children,
	match,
}) => {
	const { treeData: { geom, place } } = TreeSelectors();
	
	return (
	    <Wrapper hideFooter={true}>
			<SC.MainWrapper>
				<SC.Content>
					<Header
						handleTabChange={handleTabChange} 
						match={match}
					/>
					<SC.Main >
						{children}
					</SC.Main>
					<Footer/>
				</SC.Content>
				  <Mapa
					geom={geom}
					countyName={place}
					hideZoom={false}
					disableInteractions={false}
				/>
			</SC.MainWrapper>
		</Wrapper>
	);
};

Template.propTypes = {
	// setCommentState: PropTypes.func.isRequired,
	handleTabChange: PropTypes.func.isRequired,
	children: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
};

export default Template;