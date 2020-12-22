import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { Text } from 'shared';
import * as SC from '../../style';

const Title = ({ countyName, planName }) => {
	const theme = useTheme();

	return (
		<>
			<SC.SubTitleWrapper>
				<Text size="18px" weight="700" text={countyName} component="span" color={theme.palette.primary.main}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="18px" lineHeight="1.4" weight="600" text={planName} component="h1" color={theme.palette.black}/>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	planName: PropTypes.string,
	countyName: PropTypes.string,
};

export default Title;