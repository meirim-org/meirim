import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import styled from 'styled-components';

const StyledButton = styled(MUIButton)`
	font-size: 16px !important;
	font-stretch: normal;
	line-height: 1.5;
	letter-spacing: normal;
	text-align: center; 
    color: #ffffff !important;
    background-color: #652dd0 !important;
    min-height: 3.7em;
    border-radius: 12px !important;
    font-weight: 700 !important;
    border: 1px solid #652dd0 !important;
    min-width: auto !important;
    
    .MuiButton-label  {
    	font-family: Assistant !important;
    }
    &:hover {
      background-color: #4d20b2 !important;
    }
    &:focus {
       outline: none;
    }
    
    ${({ simple }) => simple && `
        font-weight: 600 !important;
        color: #652dd0 !important;
        border: none !important;
        background-color: #ffffff !important;
        min-height: auto !important;
        padding: 0 !important;
        transition: 0.3s !important;
        > span {
            line-height: 1 !important;
        }
       &:hover {
          color: #8f5de2 !important;
          background-color: transparent !important;
       }
    `}
    
    ${({ altcolor }) => altcolor && `
        color: #652dd0 !important;
        background-color: #ffffff !important;
       &:hover {
          background-color: rgba(101, 45, 208, 0.04) !important;
       }
    `}
       
    ${({ small }) => small && `
        font-weight: 400 !important;
        padding: 0.03rem 0.6rem !important;
        border-radius: 4px !important;
        min-height: 1em;
    `}
    
    ${({ fontWeight }) => fontWeight && `
        font-weight: ${fontWeight} !important;
    `}
    
    ${({ textcolor }) => textcolor && `
        color: ${textcolor} !important;
    `}    
    
    ${({ textcolor }) => textcolor && `
        color: ${textcolor} !important;
    `}
    
    
     ${({ textcolor }) => textcolor && `
        color: ${textcolor} !important;
    `}
    
    ${({ iconbefore, iconafter }) => (iconbefore || iconafter) && `
       .MuiSvgIcon-root {
             margin: 0 .25rem;
        }
    `}

`;

const Button = ({
	text,
	id,
	onClick,
	small,
	altColor,
	simple,
	fontWeight,
	textColor,
	iconBefore,
	iconAfter
}) => (
	<StyledButton
		id={id}
		small={small ? '1' : ''}
		onClick={onClick}
		altcolor={altColor ? '1' : ''}
		simple={simple ? '1' : ''}
		fontWeight={fontWeight}
		disableRipple={simple}
		textcolor = {textColor ? '1' : ''}
		iconbefore={iconBefore ? '1' : ''}
		iconafter={iconAfter}
	>
		{iconBefore}
		{text}
		{iconAfter}
	</StyledButton>
);

Button.defaultProps = {
	small: false,
	altColor: false,
	simple: false
}

Button.propTypes = {
	id: PropTypes.string,
	text: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	small: PropTypes.bool,
	altColor: PropTypes.bool,
	simple: PropTypes.bool,
	fontWeight: PropTypes.string,
	textColor: PropTypes.string,
	iconBefore: PropTypes.object,
	iconAfter: PropTypes.object
};

export default Button;
