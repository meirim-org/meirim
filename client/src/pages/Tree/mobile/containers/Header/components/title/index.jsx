import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'shared';
import * as SC from '../../style';
import { colors } from 'style';

const Title = ({ place, text }) => {
	return (
		<>
			<SC.SubTitleWrapper>
				<Text size="18px" weight="700" text={place} component="span" color={colors.purple[500]}/>
			</SC.SubTitleWrapper>
			<SC.TitleWrapper>
				<Text size="18px" lineHeight="1.4" weight="600" text={text} component="h1" color={colors.black}/>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	place: PropTypes.string,
	text: PropTypes.string
};

export default Title;
