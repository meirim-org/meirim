import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import { BackButton } from 'pages/Tree/common';
import { goBack } from 'pages/Tree/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { Text, Typography } from 'shared';
import * as SC from '../../style';

const Title = ({ place, text }) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<>
			<SC.SubTitleWrapper>
				<BackButton onclick={goBack} label={t.backToComments} classname="back-button"/>
				<Text size="18px" weight="700" text={place} component="span" color={theme.palette.primary.main}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="24px" lineheight="1.17" weight="600" text={text} component="h1" color={theme.palette.black}/>
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
