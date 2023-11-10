import React from 'react';
import * as SC from './style';
import { Button } from 'shared';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { openModal } from '../../../../redux/modal/slice';
import { useDispatch } from 'react-redux';
import { useTranslation } from '../../../../locale/he_IL';

const EmptyState = ({ type }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	return (
		<SC.NoAlertsDivWrapper>
			<SC.NoAlertsDiv>
				<p>{t.emptyState}</p>
				<Button
					text={t.addAlert}
					fontSize="18px"
					fontWeight="600"
					small
					padding="12px 20px"
					borderradius="8px"
					iconBefore={<AddIcon />}
					lineheight="24px"
					onClick={() =>
						dispatch(
							openModal({
								modalType: 'addAlert',
								modalProps: {
									wrapperClass: 'alertModal',
									type: type === 'trees' ? 'tree' : 'plan',
								},
							})
						)
					}
				/>
			</SC.NoAlertsDiv>
		</SC.NoAlertsDivWrapper>
	);
};

EmptyState.propTypes = {
	type: PropTypes.string.isRequired,
};

export default EmptyState;
