import { useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { TabBox, TabPanel, Typography } from 'shared';
import * as SC from './style';
import HeaderComment from '../../../../components/HeaderComment/HeaderComment';

const CommentView = ({ commentData, isNewCommentOpen, children }) => {
	const theme = useTheme();
	const {
		content,
		created_at,
		person: {
			name,
			type: personType,
			status,
			url,
			email_public,
			linkedin,
			twitter,
			facebook,
			title,
			about_me_public,
		},
		type,
	} = commentData;

	return (
		<TabPanel>
			<TabBox isComment={true} disabled={isNewCommentOpen}>
				<HeaderComment
					created_at={created_at}
					name={name}
					status={status}
					url={url}
					personType={personType}
					type={type}
					title={title}
					facebook={facebook}
					twitter={twitter}
					linkedin={linkedin}
					email_public={email_public}
					about_me_public={about_me_public}
				/>
				<SC.Text>
					<Typography
						variant="paragraphText"
						mobileVariant="paragraphText"
						component="p"
						color={theme.palette.black}
					>
						{content}
					</Typography>
				</SC.Text>
				{children}
			</TabBox>
		</TabPanel>
	);
};

CommentView.defaultProps = {
	isNewCommentOpen: false,
};

CommentView.propTypes = {
	commentData: PropTypes.object.isRequired,
	isNewCommentOpen: PropTypes.bool.isRequired,
	children: PropTypes.any,
};

export default CommentView;
