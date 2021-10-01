import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { colors } from 'style';

const StyledButton = withTheme(styled(MUIButton)`
	font-size: 16px !important;
	font-stretch: normal;
	line-height: 1.5;
	letter-spacing: normal
	text-align: center; 
    color: ${colors.white} !important;
    background-color: ${colors.purple[500]} !important;
    min-height: 3.7em;
    border-radius: 12px !important;
    font-weight: 700 !important;
    border: 1px solid ${colors.purple[500]} !important;
    min-width: auto !important;
    
    .MuiButton-label  {
    	font-family: Assistant !important;
        text-transform: none !important;
    }    
    
    &:hover {
      background-color: ${colors.purple[600]} !important;
    }
    &:focus {
       outline: none;
    }
    
    ${({ simple }) => simple && `
        font-weight: 600 !important;
        color: ${colors.purple[500]} !important;
        border: none !important;
        background-color: transparent !important;
        min-height: auto !important;
        padding: 0 !important;
        transition: 0.3s !important;
        > span {
            line-height: 1 !important;
        }
       &:hover {
          color: ${colors.purple[400]} !important;
          background-color: transparent !important;
       }
    `}

    ${({ altcolor }) => altcolor && `
        color: ${colors.purple[500]} !important;
        background-color: ${colors.white} !important;
       &:hover {
          background-color: ${colors.purple[500]} !important;
       }
    `}
       
    ${({ small }) => small && `
        font-weight: 400 !important;
        padding: 0.03rem 0.6rem !important;
        border-radius: 4px !important;
        min-height: 1em;
    `}
    
    ${({ extrasmall }) => extrasmall && `
        font-weight: 400 !important;
        font-size: 14px !important;
        min-height: 1.374rem;
        padding: 0.03rem 0.45rem !important;
        border-radius: 4px !important;
        > span {
            line-height: 1;
        }
`}

    ${({ fontWeight }) => fontWeight && `
        font-weight: ${fontWeight} !important;
    `}

    
    ${({ iconbefore, iconafter }) => (iconbefore || iconafter) && `
       .MuiSvgIcon-root {
             margin: 0 .25rem;
        }
    `}    
    
    ${({ active }) => active && `
        background-color: ${colors.purple[500]} !important;
    `}    
    
    ${({ disabled }) => disabled && `
        color: ${colors.grey[500]} !important;
    `}    
    
    ${({ textcolor }) => textcolor && `
        color: ${textcolor} !important;
    `}   

    ${({ fontSize }) => fontSize && `
        font-size: ${fontSize} !important;
    `}   

    ${({ textDecoration }) => textDecoration && `
        text-decoration: ${textDecoration} !important;
    `}   
    
    ${({ width }) => width && `
        width: ${width} !important;
    `}   
    
`);

const Button = ({
	text,
	id,
	to,
	component,
	href,
	target,
	onClick,
	small,
	extrasmall,
	altColor,
	simple,
	fontWeight,
	textcolor,
	textDecoration,
	fontSize,
	iconBefore,
	iconAfter,
	active,
	disabled,
	width
}) => {
	const theme = useTheme();

	return (
		<StyledButton
			id={id}
			to={to}
			component={component}
			href={href}
			target={target}
			small={small ? '1' : ''}
			extrasmall={extrasmall ? '1' : ''}
			onClick={onClick}
			altcolor={altColor ? '1' : ''}
			simple={simple ? '1' : ''}
			fontWeight={fontWeight}
			disableRipple={simple}
			textcolor={textcolor}
			fontSize={fontSize}
			textDecoration={textDecoration}
			iconbefore={iconBefore}
			iconafter={iconAfter}
			active={active ? 1 : ''}
			disabled={disabled}
			theme={theme}
			width={width}
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
	extrasmall: false,
	disabled: false,
	active: false,
};

Button.propTypes = {
	id: PropTypes.string,
	text: PropTypes.string,
	to: PropTypes.string,
	component: PropTypes.any,
	href: PropTypes.string,
	target: PropTypes.string,
	onClick: PropTypes.func,
	small: PropTypes.bool,
	extrasmall: PropTypes.bool,
	altColor: PropTypes.bool,
	simple: PropTypes.bool,
	fontWeight: PropTypes.string,
	textcolor: PropTypes.string,
	fontSize: PropTypes.string,
	textDecoration: PropTypes.string,
	iconBefore: PropTypes.object,
	iconAfter: PropTypes.object,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	width: PropTypes.string,
};

export default Button;
