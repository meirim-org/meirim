import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'shared';
import * as SC from './style';
import { useTheme } from '@material-ui/styles';
import HeaderComment from '../../../../components/HeaderComment/HeaderComment';

const SubCommentView = ({ subCommentData }) => {
	const theme = useTheme();
	const {
		content,
		created_at,
		person: {
			name,
			status,
			type: personType,
			url,
			email_public,
			linkedin,
			twitter,
			facebook,
			title,
			about_me_public,
		},
	} = subCommentData;

	return (
		<>
			<SC.SubCommentBox>
				<HeaderComment
					mode="subComment"
					name={name}
					url={url}
					status={status}
					created_at={created_at}
					personType={personType}
					title={title}
					facebook={facebook}
					twitter={twitter}
					linkedin={linkedin}
					email_public={email_public}
					about_me_public={about_me_public}
				/>
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

SubCommentView.propTypes = {
	subCommentData: PropTypes.object.isRequired,
};

export default SubCommentView;
