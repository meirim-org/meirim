import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

const StyledText = styled(Box)`
    font-size: ${props => props.size};
    font-weight: ${props => props.weight};
    color: ${props => props.color};
    line-height: ${props => props.lineHeight};
`;

const Text = ({ component, size, weight, color, lineHeight }) => (
	<StyledText 
		as={component}
		size={size} 
		weight={weight} 
		color={color}
		lineHeight={lineHeight}
	  />
);

Text.propTypes = {
	component: PropTypes.string.isRequired,
	size: PropTypes.string,
	weight: PropTypes.string,
	color: PropTypes.string,
	lineHeight: PropTypes.string,
};

export default Text;

