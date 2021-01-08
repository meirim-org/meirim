import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

const StyledTabBox = withTheme(styled.div`
    position: ${props => props.position};
    background-color: ${props => props.bgColor};
    border-radius: 12px;
    border: solid 1px ${props => props.borderColor};
    padding: 1.5rem;
    margin-bottom: 1.3rem;
    
    ${({ isComment }) => isComment && `
        display: grid;
        padding: 0;
        border-radius: 4px;
        grid-template-columns: 1fr 1fr;
        // grid-template-areas:
        //     'header header'
        //     'text text'
        //     'like add-comment'
        //     'form form'
        //     'comments comments';
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
	bgColor,
	position,
	borderColor,
	children
}) => (
	<StyledTabBox 
		isComment={isComment}
		disabled={disabled}
		bgColor={bgColor}
		borderColor={borderColor} 
		position={position}>
		{children}
	</StyledTabBox>
);

TabBox.defaultProps = {
	isComment: false,
	disabled: false,
	bgColor: '#ffffff',
	borderColor: '#E4E4E4',
	position: 'static'
};


TabBox.propTypes = {
	isComment: PropTypes.bool,
	children: PropTypes.any,
	bgColor: PropTypes.string,
	borderColor: PropTypes.string,
	disabled: PropTypes.bool,
	position: PropTypes.string
};

export default TabBox;
