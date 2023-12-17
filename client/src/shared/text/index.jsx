import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledText = styled.div`
    font-size: ${props => props.size};
    font-weight: ${props => props.weight};
    color: ${props => props.color};
    line-height: ${props => props.lineHeight};
`;

const Text = ({ component, size, weight, color, lineHeight, text }) => {

	return (
		<StyledText 
			as={component}
			size={size} 
			weight={weight} 
			color={color}
			lineHeight={lineHeight}
		>
			{text}
		</StyledText>
	);

};



Text.defaultProps = {
	component: 'span',
	size: '16px',
	weight: '400',
	lineHeight: '1.3',
	color: '#000000',
	text: ''
};


Text.propTypes = {
	component: PropTypes.string,
	size: PropTypes.string,
	weight: PropTypes.string,
	color: PropTypes.string,
	lineHeight: PropTypes.string,
	text: PropTypes.string.isRequired,
};

export default Text;

