import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { Text } from 'shared';
import * as SC from '../../style';

const Title = ({ title, subTitle }) => {
	const theme = useTheme();

	return (
		<>
			{title &&
                <SC.SubTitleWrapper>
                	<Text size="18px" weight="700" text={title} component="span" color={theme.palette.primary.main}/>
                </SC.SubTitleWrapper>
			}
			<SC.TitleWrapper>
				<Text size="18px" lineheight="1.4" weight="600" text={subTitle} component="h1" color={theme.palette.black}/>
			</SC.TitleWrapper>
		</>
	);
};

Title.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string
};

export default Title;
