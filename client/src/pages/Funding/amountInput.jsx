import { useTranslation } from 'locale/he_IL';
import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

function AmountInput(props) {
	const { inputRef, onChange, ...other } = props;
	const { t } = useTranslation();

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
