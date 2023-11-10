import MUIModal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Payment from 'pages/Funding/modals/payment';
import TermsOfPayment from 'pages/Funding/modals/termsOfPayment';
import ThankYou from 'pages/Funding/modals/thankYou';
import Login from 'pages/Login';
import SharePlanView from 'pages/Plan/common/Views/sharePlan';
import Register from 'pages/Register/';
import EmailVerified from 'pages/Register/emailVerified';
import ShareTreeView from 'pages/Tree/common/Views/shareTree';
import Video from 'pages/UrbanPlanning/video';
import PropTypes from 'prop-types';
import React from 'react';
import { ModalActions } from 'redux/actions';
import { ModalSelectors } from 'redux/selectors';
import { device } from 'style';
import styled from 'styled-components';
import UserProfile from '../../components/UserProfile/UserProfile';
import AlertModal from '../../components/AlertList/components/AlertModal';
import UpgradeModal from 'components/AlertList/components/UpgradeModal/UpgradeModal';
import SuccessUpgradeModal from '../../components/AlertList/components/SuccessUpgradeModal';
import SuccessCancelModal from '../../components/AlertList/components/SuccessCancelModal';
import CancelSubscriptionModal from '../../components/AlertList/components/CancelSubscriptionModal';
import IframeModal from '../../components/AlertList/components/IframeModal';
import EditAlertModal from '../../components/AlertList/components/EditAlertModal';
import DowngradeSubscriptionModal from "../../components/AlertList/components/DowngradeSubscriptionModal";

const StyledModal = styled(MUIModal)`
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: scroll;
`;

const StyledIcon = styled(CloseIcon)`
	color: gray;
	cursor: pointer;
`;

const ModalWrapper = styled.div``;

const ModalContentWRapper = styled.div`
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	min-width: 35%;
	border-radius: 15px 15px;
	width: 100%;
	@media ${device.tablet} {
		max-width: initial;
		width: unset;
	}

	&.profileModal {
		min-width: inherit;
		max-width: initial;
		width: unset;
	}

	&.alertModal {
		position: relative;
		padding: 40px;
		max-width: 640px;

		.iconWrapper {
			position: absolute;
			padding: 0;
			top: 28px;
			left: 28px;
			z-index: 99999;

			svg {
				fill: black;
			}
		}
	}

	&.upgradeModal {
		position: relative;
		padding: 40px;

		@media screen and (max-width: 768px) {
			padding: 20px;
		}

		.iconWrapper {
			position: absolute;
			padding: 0;
			top: 18px;
			right: 22px;
		}
	}

	&.newDesignModal {
		position: relative;
		padding: 40px;
		min-width: 932px;

		@media screen and (max-width: 975px) {
			min-width: auto;
		}

		@media screen and (max-width: 768px) {
			padding: 20px;
		}

		.iconWrapper {
			position: absolute;
			padding: 0;
			top: 18px;
			right: 22px;
		}
	}

	&.videoModal {
		background-color: unset;
		position: relative;

		@media ${device.mobile} {
			.iconWrapper > * {
				color: #918899;
				right: -25px;
				top: -25px;
			}
		}

		@media ${device.tablet} {
			max-width: initial;
			width: unset;

			.iconWrapper > * {
				color: #918899;
				position: absolute;
				right: -25px;
				top: -25px;
			}
		}
	}
`;

const IconWrapper = styled.div`
	padding-top: 0.5em;
	padding-right: 0.5em;
`;

const modalComponents = {
	login: Login,
	register: Register,
	emailVerified: EmailVerified,
	share: SharePlanView,
	payment: Payment,
	termsOfPayment: TermsOfPayment,
	thankYou: ThankYou,
	shareTree: ShareTreeView,
	video: Video,
	profile: UserProfile,
	addAlert: AlertModal,
	editAlert: EditAlertModal,
	upgradeModal: UpgradeModal,
	successUpgradeModal: SuccessUpgradeModal,
	successCancelModal: SuccessCancelModal,
	downgradeSubscriptionModal: DowngradeSubscriptionModal,
	cancelSubscriptionModal: CancelSubscriptionModal,
	iframeModal: IframeModal,
};

const Modal = ({ id }) => {
	const { open, modalType, modalProps } = ModalSelectors();
	const ModalChildren = modalComponents[modalType];

	return (
		<ModalWrapper id={`wrapper-${id}`}>
			<StyledModal onClose={ModalActions().close} id={id} open={open}>
				<ModalContentWRapper className={modalProps?.wrapperClass}>
					<IconWrapper className="iconWrapper">
						<StyledIcon onClick={ModalActions().close} />
					</IconWrapper>
					{modalType && <ModalChildren {...modalProps} />}
				</ModalContentWRapper>
			</StyledModal>
		</ModalWrapper>
	);
};

Modal.propTypes = {
	children: PropTypes.object,
	id: PropTypes.string,
};

export default Modal;
