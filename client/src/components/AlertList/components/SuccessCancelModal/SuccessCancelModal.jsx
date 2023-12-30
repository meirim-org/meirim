import React, { useEffect } from 'react';
import * as SC from './style';
import GreenTickCircle from '../../../../shared/icons/GreenTickCircle';
import { ModalActions } from '../../../../redux/actions';
import { useUpdateManuallyUserState } from '../../../../scenes/alerts/hooks';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../../locale/he_IL';

const SuccessCancelModal = ({ endDate }) => {
	const { handleGetMe } = useUpdateManuallyUserState();
	const { t } = useTranslation();

	useEffect(() => {
		handleGetMe();
	}, [handleGetMe]);

	return (
		<>
			<SC.IconWrapper>
				<GreenTickCircle />
			</SC.IconWrapper>

			<SC.TextWrapper>
				<SC.Heading>
					<SC.BoldColored>{t.yourPlanHasBeenCanceled}</SC.BoldColored>
				</SC.Heading>

				<SC.P_bold>{t.fromNowNoAdditionalCharges}</SC.P_bold>

				<SC.P>{t.youCanUpdateAgainInAnyMoment}</SC.P>

				<SC.P>Your subscription will stay active until {endDate}</SC.P>
			</SC.TextWrapper>

			<SC.ButtonWrapper>
				<SC.Button onClick={ModalActions().close}>{t.close}</SC.Button>
			</SC.ButtonWrapper>
		</>
	);
};

export default SuccessCancelModal;

SuccessCancelModal.propTypes = {
	endDate: PropTypes.string,
};
