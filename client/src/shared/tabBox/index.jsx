import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles'

const StyledTabBox = withTheme(styled.div`
    background: ${props => props.theme.palette.white};
    border-radius: 12px;
    border: solid 1px ${props => props.theme.palette.gray['300']};
    padding: 1.5rem;
    margin-bottom: 1.3rem;
`);

const TabBox = ({
	children
}) => (
	<StyledTabBox>
		{children}
	</StyledTabBox>
);

TabBox.propTypes = {
	children: PropTypes.any,
};

export default TabBox;
