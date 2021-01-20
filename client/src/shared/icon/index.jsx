/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

const StyledIcon = styled(IconButton)`
  
   ${({ color }) => color  && `
        path { 
            fill: ${color};
        }
    `}
   
    ${({ fontSize }) => fontSize  && `
        svg { 
            font-size: ${fontSize}px;
        }
    `}
    
    &:focus {
        outline: none;
    }

`;

const Component = ({ ariaLabel, color, children, fontSize, onClick }) => {
	return (
		<StyledIcon aria-label={ariaLabel} color={color} fontSize={fontSize} onClick={onClick}>
			{children}
		</StyledIcon>
	);
};

Component.defaultProps = {
	fontSize: 30,
};

Component.propTypes = {
	ariaLabel: PropTypes.string.isRequired,
	children: PropTypes.object.isRequired,
	color: PropTypes.string,
	fontSize: PropTypes.number,
	onClick: PropTypes.func
};

export default Component;

