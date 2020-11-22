import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';
import styled from 'styled-components';

const StyledButton = styled(MUIButton)`
	border-radius: ${(props) => (props.borderradius)};
	font-size: 16px;
	font-weight: bold !important;
	font-stretch: normal;
	line-height: 1.5;
	letter-spacing: normal;
	text-align: center;
	color: #ffffff;
	background-color: #652dd0 !important;
  min-height: ${(props) => (props.minhegiht)};
  .MuiButton-label  {
    	font-family: Assistant !important;
    }
    &:focus {
       outline: none;
    }
`;

const Button = ({ text, id, onClick, small = false }) => {
	const minHegiht = small ? '1em' : '3.7em'
	const borderRadius = small ? '8px !important' : '12px !imporatnt'
	
	return (
		<StyledButton id={id} size="small" minhegiht={minHegiht} borderradius={borderRadius} onClick={onClick} variant="contained" color="primary">
			{text}
		</StyledButton>
	)};

Button.defaultProps = {
	small: false
}

Button.propTypes = {
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	small: PropTypes.bool,
};

export default Button;
