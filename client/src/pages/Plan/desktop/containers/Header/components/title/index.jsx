import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'locale/he_IL';
import { BackButton } from 'pages/Plan/common';
import { goBack } from 'pages/Plan/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'shared';
import * as SC from '../../style';


const Title = ({ countyName, planName }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	return (
		<>
			<SC.SubTitleWrapper>
				<BackButton onclick={goBack} label={t.backToComments} classname="back-button"/>
				<Text size="18px" weight="700" text={countyName} component="span" color={theme.palette.primary.main}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="24px" lineheight="1.17" weight="600" text={planName} component="h1" color={theme.palette.black}/>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	planName: PropTypes.string,
	countyName: PropTypes.string,
};

export default Title;
