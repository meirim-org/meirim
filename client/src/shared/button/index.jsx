import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

const StyledButton = withTheme(styled(MUIButton)`
	font-size: 16px !important;
	font-stretch: normal;
	line-height: 1.5;
	letter-spacing: normal;
	text-align: center; 
    color: ${props => props.theme.palette.white} !important;
    background-color: ${props => props.theme.palette.primary.main} !important;
    min-height: 3.7em;
    border-radius: 12px !important;
    font-weight: 700 !important;
    border: 1px solid ${props => props.theme.palette.primary.main} !important;
    min-width: auto !important;
    
    .MuiButton-label  {
    	font-family: Assistant !important;
    }
    &:hover {
      background-color: ${props => props.theme.palette.primary['600']} !important;
    }
    &:focus {
       outline: none;
    }
    
    ${({ simple, theme }) => simple && `
        font-weight: 600 !important;
        color: ${theme.palette.primary.main} !important;
        border: none !important;
        background-color: transparent !important;
        min-height: auto !important;
        padding: 0 !important;
        transition: 0.3s !important;
        > span {
            line-height: 1 !important;
        }
       &:hover {
          color: ${theme.palette.primary['400']} !important;
          background-color: transparent !important;
       }
    `}

    ${({ altcolor, theme }) => altcolor && `
        color: ${theme.palette.primary.main} !important;
        background-color: ${theme.palette.white} !important;
       &:hover {
          background-color: ${theme.palette.primary['custom']} !important;
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

    
    ${({ iconbefore, iconafter }) => (iconbefore || iconafter) && `
       .MuiSvgIcon-root {
             margin: 0 .25rem;
        }
    `}    
    
    ${({ active, theme }) => active && `
        background-color: ${theme.palette.primary['custom']} !important;
    `}    
    
    ${({ disabled, theme }) => disabled && `
        color: ${theme.palette.gray.main} !important;
    `}    
    
    ${({ textcolor }) => textcolor && `
        color: ${textcolor} !important;
    `}   
    
`);

const Button = ({
	text,
	id,
	onClick,
	small,
	altColor,
	simple,
	fontWeight,
	textcolor,
	iconBefore,
	iconAfter,
	active,
	disabled,
}) => {
	const theme = useTheme();

	return (
		<StyledButton
			id={id}
			small={small ? '1' : ''}
			onClick={onClick}
			altcolor={altColor ? '1' : ''}
			simple={simple ? '1' : ''}
			fontWeight={fontWeight}
			disableRipple={simple}
			textcolor={textcolor}
			iconbefore={iconBefore}
			iconafter={iconAfter}
			active={active ? 1 : ''}
			disabled={disabled}
			theme={theme}
		>
			{iconBefore}
			{text}
			{iconAfter}
		</StyledButton>
	);
};

Button.defaultProps = {
	small: false,
	altColor: false,
	simple: false,
	disabled: false,
	active: false,
};

Button.propTypes = {
	id: PropTypes.string,
	text: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	small: PropTypes.bool,
	altColor: PropTypes.bool,
	simple: PropTypes.bool,
	fontWeight: PropTypes.string,
	textcolor: PropTypes.string,
	iconBefore: PropTypes.object,
	iconAfter: PropTypes.object,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default Button;
