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
    
    ${({ isOpinion }) => isOpinion && `
        display: grid;
        padding: 0;
        border-radius: 4px;
        grid-template-areas:
            'header header'
            'text text'
            'like add-comment'
            'comments comments'
            ;
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
            background-color: ${props => props.theme.palette.white};
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
	bgColor,
	position,
	borderColor,
	children
}) => (
	<StyledTabBox 
		isOpinion={isOpinion}
		disabled={disabled}
		bgColor={bgColor}
		borderColor={borderColor} 
		position={position}>
		{children}
	</StyledTabBox>
);

TabBox.defaultProps = {
	isOpinion: false,
	disabled: false,
	bgColor: '#ffffff',
	borderColor: '#E4E4E4',
	position: 'static'
};


TabBox.propTypes = {
	isOpinion: PropTypes.bool,
	children: PropTypes.any,
	bgColor: PropTypes.string,
	borderColor: PropTypes.string,
	disabled: PropTypes.bool,
	position: PropTypes.string
};

export default TabBox;
