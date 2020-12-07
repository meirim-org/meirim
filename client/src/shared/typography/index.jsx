import React from 'react';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { device } from 'style';


const mobileTemplate = (mobileFontSize, mobileFontWeight, mobileLineHeight) => {
	return ` 
	    {
        font-size: ${mobileFontSize} !important;
        font-weight: ${mobileFontWeight} !important;
        line-height: ${mobileLineHeight} !important; 
        }
`
}

const template = (fontSize, fontWeight, lineHeight) => {
	return `
         @media ${device.tablet} {
            font-size: ${fontSize} !important;
            font-weight: ${fontWeight} !important;
            line-height: ${lineHeight} !important; 
         }
    `
}

const handleVariant = variant => {
	switch (variant) {
	case 'megaHeadTitle':
		return template('48px', '400', '1.25');
	case 'planTitle':
		return template('24px', '600', '1.17');
	case 'planDetailTitle':
		return template('18px', '600', '1.5');
	case 'menuTitle':
		return template('16px', '400', '1.33');
	case 'paragraphText':
		return template('16px', '400', '1.5');
    case 'paragraphTextLight':
        return template('16px', '300', '1.3');
	case 'highlightedText':
		return template('16px', '600', '1.33');
	case 'smallTitle':
		return template('14px', '600', '1.29');
	case 'chipsAndIconButtons':
		return template('14px', '400', '1.29');
    case 'light':
        return template('14px', '300', '1.3');
	case 'label':
		return template('12px', '400', '1.5');
	default:
		return template('16px', '700', '1.5');
	}	    
};

const handleMobileVariant = mobileVariant => {
	switch (mobileVariant) {
	case 'title':
		return mobileTemplate('36px', '400', '1.33');
	case 'planTitle':
		return mobileTemplate('24px', '600', '1.17');
	case 'cardTitle':
		return mobileTemplate('18px', '600', '1.5');
	case 'sideMenu':
		return mobileTemplate('18px', '400', '1.67');
	case 'planDetailTitle':
		return mobileTemplate('16px', '600', '1.67');
	case 'highlightedText':
		return mobileTemplate('16px', '600', '1.5');
	case 'menuTitle':
		return mobileTemplate('16px', '400', '1.33');
	case 'paragraphText':
		return mobileTemplate('16px', '400', '1.5');
    case 'paragraphTextLight':
            return template('16px', '300', '1.3');
	case 'smallTitle':
		return mobileTemplate('14px', '600', '1.29');
	case 'chipsAndIconButtons':
		return mobileTemplate('14px', '400', '1.29');
    case 'light':
        return template('14px', '300', '1.3');
	case 'label':
		return mobileTemplate('12px', '400', '1.5');
	default:
		return mobileTemplate('16px', '400', '1.5');
	}
};


const StyledTypography = styled(Box)`
   ${({ mobileVariant }) => mobileVariant && handleMobileVariant(mobileVariant) }
   ${({ variant }) => variant && handleVariant(variant) }
    color: ${props => props.color} !important;
`;

const Typography = ({ component, variant, mobileVariant, color, children }) => (
	<StyledTypography as={component} variant={variant} mobileVariant={mobileVariant} color={color}>
		{children}
	</StyledTypography>
);

Typography.propTypes = {
	component: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
	variant: PropTypes.oneOf([
		'megaHeadTitle',
		'title',
		'planTitle',
		'planDetailTitle',
		'menuTitle',
		'paragraphText',
        'paragraphTextLight',
		'highlightedText',
		'smallTitle',
		'chipsAndIconButtons',
		'light',
		'label',
	]).isRequired,
	mobileVariant: PropTypes.oneOf([
		'title',
		'planTitle',
		'cardTitle',
		'sideMenu',
		'planDetailTitle',
		'highlightedText',
		'menuTitle',
		'paragraphText',
        'paragraphTextLight',
        'smallTitle',
		'chipsAndIconButtons',
		'light',
		'label',
	]).isRequired,
};

export default Typography;

