import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { Text } from 'shared';
import * as SC from '../../style';
import { BackButton } from 'pages/Plan/common';
import t from 'locale/he_IL';


const Title = ({ countyName, planName }) => {
	const history = useHistory();
	const theme = useTheme();

	return (
		<>
			<SC.SubTitleWrapper>
				<BackButton onclick={()=> {history.push('/plans');}} label={t.backToComments} classname="back-button"/>
				<Text size="18px" weight="700" text={countyName} component="span" color={theme.palette.primary.main}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="24px" lineHeight="1.17" weight="600" text={planName} component="h1" color={theme.palette.black}/>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	planName: PropTypes.string,
	countyName: PropTypes.string,
};

export default Title;