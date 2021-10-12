import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'shared';
import * as SC from '../../style';
import { BackButton } from 'pages/Tree/common';
import { goBack } from 'pages/Tree/utils';
import t from 'locale/he_IL';
import { Typography } from 'shared';
import { colors } from 'style';

const Title = ({ place, text }) => {
	return (
		<>
			<SC.SubTitleWrapper>
				<BackButton onclick={goBack} label={t.backToComments} classname="back-button"/>
				<Text size="18px" weight="700" text={place} component="span" color={colors.purple[500]}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="24px" lineHeight="1.17" weight="600" text={text} component="h1" color={colors.black}/>
				<Typography variant="paragraphText" mobileVariant="paragraphText"
					component="span" color={colors.grey[500]}>
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