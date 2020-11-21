/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import Label from '../label';

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
`;

const Component = ({ ariaLabel, color, children, fontSize  }) => {
	return (
		<StyledIcon aria-label={ariaLabel} color={color} fontSize={fontSize}>
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
};

export default Component;

