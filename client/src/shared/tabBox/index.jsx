import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles'

const StyledTabBox = withTheme(styled.div`
    background: ${props => props.theme.palette.white};
    border-radius: 12px;
    border: solid 1px ${props => props.theme.palette.gray['300']};
    padding: 1.5rem;
    margin-bottom: 1.3rem;
    
    ${({ isOpinion }) => isOpinion && `
        display: grid;
        padding: 0;
        border-radius: 4px;
        grid-template-areas:
            'header header'
            'text text'
            'like add-comment';
    `}  
      
    ${({ disabled }) => disabled && `
        pointer-events: none;
        user-select: none;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            opacity: 0.7;
            z-index: 1;
            top: 0;
            left: 0;
        } 
    `}
    
`);

const TabBox = ({
    isOpinion,
    disabled,
	children
}) => (
	<StyledTabBox isOpinion={isOpinion} disabled={disabled}>
		{children}
	</StyledTabBox>
);

TabBox.defaultProps = {
    isOpinion: false,
    disabled: false
};


TabBox.propTypes = {
    isOpinion: PropTypes.bool,
    children: PropTypes.any,
};

export default TabBox;
