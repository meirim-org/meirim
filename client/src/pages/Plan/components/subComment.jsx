import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'shared';
import * as SC from './style';
import { useTheme } from '@material-ui/styles';

export const SubComment = ({ key, subCommentData }) => {
	const theme = useTheme();
	const { content } = subCommentData;
	const { name } = subCommentData.person;
	
	return (
		<>
			<SC.SubCommentBox key={key}>
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
						{/* {daysPassed(comment.timeStamp)} */}
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
	key: PropTypes.string.isRequired,
};
