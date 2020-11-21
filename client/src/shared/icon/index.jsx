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
`;

const Icon = ({ ariaLabel, color, children  }) => {
	return (
		<StyledIcon aria-label={ariaLabel} color={color}>
			{children}
		</StyledIcon>
	);
};

Icon.propTypes = {
	ariaLabel: PropTypes.string.isRequired,
	children: PropTypes.object.isRequired,
	color: PropTypes.string
};

export default Icon;

