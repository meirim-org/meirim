import React from 'react';
import { VerifiedTooltipBox } from './style';
import { useTranslation } from '../../locale/he_IL';

const VerifiedTooltip = (props) => {
	const { t } = useTranslation();

	return (
		<VerifiedTooltipBox mode="comment" {...props}>
			{t.profileVerified}
		</VerifiedTooltipBox>
	);
};

export default VerifiedTooltip;
