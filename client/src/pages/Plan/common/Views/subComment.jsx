import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'shared';
import * as SC from './style';
import { useTheme } from '@material-ui/styles';
import { daysPassed } from 'pages/Plan/utils';
import { colors } from 'style';

const SubCommentView = ({ subCommentData }) => {
	const theme = useTheme();
	const { content, created_at, person: { name } } = subCommentData;
	
	return (
		<>
			<SC.SubCommentBox>
				<SC.SubCommentHeader>
					<SC.ArrowIcon />
					<Typography
						variant="smallTitle"
						mobileVariant="smallTitle"
						component="span"
						color={colors.black}
					>
						{name}
					</Typography>
					<Typography
						variant="light"
						mobileVariant="light"
						component="span"
						color={theme.palette.gray['main']}
					>
                        לפני
						{created_at ? daysPassed(created_at) : ' הרבה '}
                        ימים
					</Typography>
				</SC.SubCommentHeader>
				<Typography
					variant="paragraphTextLight"
					mobileVariant="paragraphTextLight"
					component="p"
					color={colors.black}
				>
					{content}
				</Typography>
			</SC.SubCommentBox>

		</>
	);
};

SubCommentView.propTypes = {
	subCommentData: PropTypes.object.isRequired,
};

export default SubCommentView;