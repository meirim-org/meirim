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
    .MuiButton-label  {
    	font-family: Assistant !important;
    }
    &:focus {
       outline: none;
    }
   
    color: #ffffff !important;
    background-color: #652dd0 !important;
    min-height: 3.7em;
    border-radius: 12px !important;
    font-weight: 700 !important;
    
    ${({ altColor }) => altColor && `
        color: #652dd0 !important;
        background-color: #ffffff !important;
    `}
       
    ${({ small }) => small && `
        font-weight: 400 !important;
        padding: 0.03rem 0.6rem !important;
        border-radius: 4px !important;
        min-height: 1em;
    `}

`;

const Button = ({ text, id, onClick, small, altColor }) => (
	<StyledButton id={id} small={small} onClick={onClick} altColor={altColor}>
		{text}
	</StyledButton>
);

Button.defaultProps = {
	small: false,
	altColor: false
}

Button.propTypes = {
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	small: PropTypes.bool,
	altColor: PropTypes.bool
};

export default Button;
