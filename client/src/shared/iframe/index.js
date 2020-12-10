import React from 'react';
import reactIframe from 'react-iframe';
import PropTypes from 'prop-types';

const Iframe = ({
	id, onChange, name, type, label, width,  error, onClose, onURLChange, 
}) => {

	return (
		<>
			<reactIframe
				id={id}
				name={name}
				onFocus={() => onFocus && onFocus(name)}
				onBlur={() => onBlur && onBlur(name)}
				size={size}
				error={error}
				width={width}
			/>
		</>
	);
}

Iframe.defaultProps = {
};

Iframe.propTypes = {
	// id: PropTypes.string.isRequired,
	// name: PropTypes.string.isRequired,
	// type: PropTypes.string.isRequired,
	// value: PropTypes.string.isRequired,
	// onFocus: PropTypes.func.isRequired,
	// onBlur: PropTypes.func.isRequired,
	// size: PropTypes.string,
	// width: PropTypes.string,
	// onChange: PropTypes.func.isRequired,
	// required: PropTypes.bool,
	// helperText: PropTypes.string,
	// label: PropTypes.string,
	// variant: PropTypes.string,
	// error: PropTypes.bool,
	// forgetPassword: PropTypes.bool,
};

export default TextInput;