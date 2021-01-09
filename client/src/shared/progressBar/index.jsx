import React from 'react';
import PropTypes from 'prop-types';
import { withTheme, useTheme } from '@material-ui/core/styles';
import MUILinearProgress from '@material-ui/core/LinearProgress';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import Typography from '../typography';

const StyledProgressBar = withTheme(styled(MUILinearProgress)`
	height: 1.75em !important;
	width: ${(props) => (props.width || '24em' )};
	border-radius: 25px;
`);

const ProgressBar = ({ value, id, width }) => {
	const theme = useTheme();

	const progress = Math.round(value);
	const progressValue = Math.min(progress, 100);

	return (
		<Box position="relative" display="inline-flex" width={width} height="1.75em">
			<StyledProgressBar id={id} value={progressValue} width={width} variant="determinate" color="primary" data-label="000"/>
			<Box
        		top={0}
        		left={0}
        		bottom={0}
        		right={0}
        		position="absolute"
        		display="flex"
        		alignItems="center"
        		justifyContent="center"
      		>
				<Typography variant="title" mobileVariant="title" color={theme.palette.white}>
					{progress}%
				</Typography>
      		</Box>
		</Box>
	);
};

ProgressBar.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired,
	width: PropTypes.string
};

export default ProgressBar;
