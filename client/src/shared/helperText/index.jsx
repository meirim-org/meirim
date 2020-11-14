import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledHelperText = styled(FormHelperText)`
  font-family: Assistant;
  font-size: 14px !important;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
	line-height: 1.5;
	text-align: right !important;
  letter-spacing: normal;
  color: ${(props) => (props.error ? '#ff3a68' : '#8f5de2 !important')} ;
`;

const HelperText = ({ text }) => (
	<>
		<StyledHelperText>{text}</StyledHelperText>
	</>
);

HelperText.propTypes = {
	text: PropTypes.string.isRequired,
};

export default HelperText;
