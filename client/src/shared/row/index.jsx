/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import MUIGrid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledRow = styled(MUIGrid)`
   ${({ gutter }) => gutter  && `
        width: calc(100% + ${gutter * 2}rem) !important;
        margin: 0 -${gutter}rem;
        > div {
            padding: 0 ${gutter}rem;
        }
    `}
`;

const Row = ({ gutter, children, alignItems, justify }) => {
	return (
		<StyledRow container gutter={gutter} alignItems={alignItems} justify={justify}>
			{children}
		</StyledRow>
	);
};

Row.defaultProps = {
	gutter: 0.5,
	alignItems: 'center',
	justify: 'flex-end'
};

Row.propTypes = {
	alignItems: PropTypes.string,
	children: PropTypes.array.isRequired,
	gutter: PropTypes.number,
	justify: PropTypes.string
};

export default Row;

