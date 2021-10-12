import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'shared';
import * as SC from '../../style';
import { colors } from 'style';

const Title = ({ title, subTitle }) => {

	return (
		<>
			{title &&
                <SC.SubTitleWrapper>
				<Text size="18px" weight="700" text={title} component="span" color={colors.purple[500]}/>
                </SC.SubTitleWrapper>
			}
			<SC.TitleWrapper>
				<Text size="18px" lineHeight="1.4" weight="600" text={subTitle} component="h1" color={colors.black}/>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string
};

export default Title;