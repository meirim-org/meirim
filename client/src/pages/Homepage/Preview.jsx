import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import purpleLogo from '../../assets/meirim-logo-purple.png';

const PreviewImageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
`

const PreviewIconWrapper = styled.div`
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LogoInnerWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const UnderDevelopment = styled.span`
    position: absolute;
    color: #391695;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    bottom: 0;
`;

const PreviewIcon = () => (
	<PreviewIconWrapper>
		<LogoInnerWrapper>
			<img src={purpleLogo} />
			<UnderDevelopment>בפיתוח</UnderDevelopment>
		</LogoInnerWrapper>
	</PreviewIconWrapper>
);

const Preview = ({ children }) => {
	return (
		<PreviewImageWrapper>
			{children}
			<PreviewIcon />
		</PreviewImageWrapper>
	)
}

Preview.propTypes = {
	children: PropTypes.element.isRequired
};
  

export default Preview;