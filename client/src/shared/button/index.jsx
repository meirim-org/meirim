import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import styled from 'styled-components';

const StyledButton = styled(MUIButton)`
	border-radius: ${(props) => (props.type === 'primary' ? '12px !important' : '8px !important')};
	font-size: 16px !important;
    font-weight: ${(props) => (props.bold ? '700 !important' : '400 !important')};
	font-stretch: normal;
	line-height: 1.5;
	letter-spacing: normal;
	text-align: center;
	color: #ffffff;
	background-color: #652dd0 !important;
    min-height: ${(props) => (props.type === 'primary' ? '3.7em' : '1em')};
    .MuiButton-label  {
    	font-family: Assistant !important;
    }
    &:focus {
       outline: none;
    }
`;

const Button = ({ text, id, onClick, type, bold }) => (
	<StyledButton id={id} type={type} onClick={onClick} variant="contained" color="primary" bold={bold}>
		{text}
	</StyledButton>
);

Button.defaultProps = {
	type: 'primary',
	bold: false
}

Button.propTypes = {
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	type: PropTypes.oneOf(['primary', 'secondary']),
	bold: PropTypes.bool,
};

export default Button;
