import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import t from 'locale/he_IL';

function AmountInput(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			allowNegative={false}
			decimalScale={0}
			prefix={t.fundingShekel}
		/>
	);
}

AmountInput.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default AmountInput;
