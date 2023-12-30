import React from 'react';
import * as SC from './style';
import { Button } from 'shared';
import PropTypes from 'prop-types';
import { withGetScreen } from 'react-getscreen';
import { useTranslation } from '../../../../../../locale/he_IL';

const CardItem = ({
	alertAmount,
	radius,
	price,
	handlePaymentRequest,
	contactUs,
	active,
	id,
	isMobile,
}) => {
	const { t } = useTranslation();

	return (
		<SC.CardItemWrapper active={active}>
			<SC.CardItem active={active}>
				<p>
					<SC.Key>{t.numberOfAddresses}: </SC.Key>
					<SC.Value>{contactUs ? '4+' : alertAmount}</SC.Value>
				</p>

				<p>
					<SC.Key>{t.radius}: </SC.Key>
					<SC.Value>
						{contactUs ? t.asNeeded : t.upTo.replace('$', radius)}
					</SC.Value>
				</p>

				{contactUs ? (
					<Button
						text={t.contactUs}
						width="165px"
						removebackground="true"
						onClick={() =>
							handlePaymentRequest({ redirectToContactUs: true })
						}
						textcolor="#8F5DE2"
						small={isMobile()}
						fontSize="24px"
						minheight="0px"
					/>
				) : (
					<Button
						text={`${price} ${t.nis} / ${t.month} `}
						width="165px"
						backgroundcolor="#8F5DE2"
						onClick={() => handlePaymentRequest({ planId: id })}
						disabled={active}
						small={isMobile()}
						fontSize="24px"
						minheight="0px"
					/>
				)}
			</SC.CardItem>

			{active && (
				<SC.CardItemWrapper__active>
					{t.yourPlan}
				</SC.CardItemWrapper__active>
			)}
		</SC.CardItemWrapper>
	);
};

CardItem.defaultProps = {
	active: false,
};

CardItem.propTypes = {
	alertAmount: PropTypes.number,
	radius: PropTypes.number,
	price: PropTypes.number,
	handlePaymentRequest: PropTypes.func.isRequired,
	contactUs: PropTypes.bool,
	active: PropTypes.bool,
	planId: PropTypes.number,
	isMobile: PropTypes.func,
};

export default withGetScreen(CardItem, {
	mobileLimit: 768,
	tabletLimit: 1024,
	shouldListenOnResize: true,
});
