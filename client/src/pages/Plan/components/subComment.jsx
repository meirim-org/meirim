import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'shared';
import * as SC from './style';
import { useTheme } from '@material-ui/styles';
import { daysPassed } from '../utils';

export const SubComment = ({ subCommentData }) => {
	const theme = useTheme();
	const { content, created_at } = subCommentData;
	const { name } = subCommentData.person;
	
	return (
		<>
			<SC.SubCommentBox>
				<SC.SubCommentHeader>
					<SC.ArrowIcon />
					<Typography
						variant="smallTitle"
						mobileVariant="smallTitle"
						component="span"
						color={theme.palette.black}
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
						{daysPassed(created_at)}
                        ימים
					</Typography>
				</SC.SubCommentHeader>
				<Typography
					variant="paragraphTextLight"
					mobileVariant="paragraphTextLight"
					component="p"
					color={theme.palette.black}
				>
					{content}
				</Typography>
			</SC.SubCommentBox>

		</>
	);
};

SubComment.propTypes = {
	subCommentData: PropTypes.object.isRequired,
};
