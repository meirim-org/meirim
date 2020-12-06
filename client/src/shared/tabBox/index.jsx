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
    
    ${({ isComment }) => isComment && `
        display: grid;
        padding: 0;
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
    isComment,
    disabled,
	children
}) => (
	<StyledTabBox isComment={isComment} disabled={disabled}>
		{children}
	</StyledTabBox>
);

TabBox.defaultProps = {
    isComment: false,
    disabled: false
};


TabBox.propTypes = {
    isComment: PropTypes.bool,
    children: PropTypes.any,
};

export default TabBox;
