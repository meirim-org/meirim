import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

const StyledButton = withTheme(styled(MUIButton)`
	${({ backgroundcolor, theme }) => `
		background-color: ${backgroundcolor || theme.palette.primary.main} !important;
		border: 1px solid ${backgroundcolor || theme.palette.primary.main} !important;
	`}

	font-size: 16px !important;
	font-stretch: normal;
	line-height: 1.5;
	letter-spacing: normal
	text-align: center; 
    color: ${props => props.theme.palette.white} !important;
    min-height: 3.7em;
    border-radius: 12px !important;
    font-weight: 700 !important;
    min-width: auto !important;
    
    .MuiButton-label  {
    	font-family: Assistant !important;
        text-transform: none !important;
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

    
    ${({ iconbefore, iconafter }) =>
		`
       .MuiSvgIcon-root {
             margin: 0;
             ${iconbefore ? `margin-left: 10px;` : ''}
             ${iconafter ? `margin-right: 10px;` : ''}
        }

        svg {
            margin: 0;
            ${iconbefore ? `margin-left: 10px;` : ''}
            ${iconafter ? `margin-right: 10px;` : ''}
        }
    `}

    
    ${({ active, theme }) =>
		active &&
		`
        background-color: ${theme.palette.primary['custom']} !important;
    `}    
    
    ${({ disabled, theme }) => disabled && `
        color: ${theme.palette.gray.main} !important;
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
	
				${({ padding }) => padding && `
        padding: ${padding} !important;
    `}

				${({ borderradius }) => borderradius && `
        border-radius: ${borderradius} !important;
    `}

    ${({ lineheight }) => lineheight && `
	       line-height: ${lineheight} !important;
				`}

    ${({ removebackground }) => removebackground === 'true' && `
        background: none !important;
        transition: opacity 0.3s !important;

        &:hover {
            background: none !important;
            opacity: 0.8;
        }
    `}

    ${({ minheight }) => `
        min-height: ${minheight} !important;
    `}

    ${({ border }) => `
        border: ${border} !important;
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
	backgroundcolor,
	textDecoration,
	fontSize,
	iconBefore,
	iconAfter,
	active,
	disabled,
	width,
	padding,
	borderradius,
	lineheight,
	removebackground,
	minheight,
	border,
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
			backgroundcolor={backgroundcolor}
			fontSize={fontSize}
			textDecoration={textDecoration}
			iconbefore={iconBefore}
			iconafter={iconAfter}
			active={active ? 1 : ''}
			disabled={disabled}
			theme={theme}
			width={width}
			padding={padding}
			borderradius={borderradius}
			lineheight={lineheight}
			removebackground={removebackground}
			minheight={minheight}
			border={border}
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
	removebackground: 'false',
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
	backgroundcolor: PropTypes.string,
	fontSize: PropTypes.string,
	textDecoration: PropTypes.string,
	iconBefore: PropTypes.object,
	iconAfter: PropTypes.object,
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	width: PropTypes.string,
	removebackground: PropTypes.string,
	minheight: PropTypes.string,
	border: PropTypes.string,
};

export default Button;
