import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';

export const Required = styled.span`
  color:red;
`;

const Label = ({ id, required = false, text }) => (
	<InputLabel id={id}>
		{text}
		{required && <Required> *</Required>}
	</InputLabel>
);

Label.defaultProps = {
	required: false,
};

Label.propTypes = {
	required: PropTypes.bool,
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};

export default Label;
