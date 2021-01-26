import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledHelperText = styled(FormHelperText)`
  font-family: Assistant !important;
  font-size: 14px !important;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  padding: 0 1rem;
	line-height: 1.5;
	text-align: right !important;
  letter-spacing: normal;
  color: ${(props) => (props.error ? '#ff3a68' : '#8f5de2 !important')} ;
`;

const HelperText = ({ id, text, error }) => {
	return (
		<>
			<StyledHelperText id={id}>{text}</StyledHelperText>
		{ error &&
				<StyledHelperText id={id}>{error}</StyledHelperText>
		}
		</>
	);
}

HelperText.propTypes = {
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	error: PropTypes.string,
};

export default HelperText;
