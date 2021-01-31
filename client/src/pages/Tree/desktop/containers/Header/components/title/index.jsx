import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { Text } from 'shared';
import * as SC from '../../style';
import { BackButton } from 'pages/Tree/common';
import { goBack } from 'pages/Tree/utils';
import t from 'locale/he_IL';
import { Typography } from 'shared';

const Title = ({ place, text }) => {
	const theme = useTheme();

	return (
		<>
			<SC.SubTitleWrapper>
				<BackButton onclick={goBack} label={t.backToComments} classname="back-button"/>
				<Text size="18px" weight="700" text={place} component="span" color={theme.palette.primary.main}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="24px" lineHeight="1.17" weight="600" text={text} component="h1" color={theme.palette.black}/>
				<Typography variant="paragraphText" mobileVariant="paragraphText"
							component="span" color={theme.palette.gray['main']}>
						{t.estimatedLocation}
					</Typography>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	text: PropTypes.string,
	place: PropTypes.string,
};

export default Title;