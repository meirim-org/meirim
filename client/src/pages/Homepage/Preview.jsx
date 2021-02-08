import React from "react";
import { withGetScreen } from "react-getscreen";
import PropTypes from "prop-types";
import styled from "styled-components";
import purpleLogo from "../../assets/meirim-logo-purple.png";
import { device } from "style";

const DesktopImage = styled.img`
    @media ${device.tablet} {
        max-width: 100%;
    }
`;

const PreviewImageWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
`;

const PreviewIconWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
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

const MobileImg = styled.div`
    width: 100vw;
    height: 420px;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-position-x: right;
    background-size: cover;
    margin-bottom: 40px;
`;

const PreviewIcon = () => (
    <PreviewIconWrapper>
        <LogoInnerWrapper>
            <img src={purpleLogo} alt="" />
            <UnderDevelopment>בפיתוח</UnderDevelopment>
        </LogoInnerWrapper>
    </PreviewIconWrapper>
);

const Preview = ({ isMobile, src, mobileSrc }) => {
    return (
        <PreviewImageWrapper>
            {isMobile() ? (
                <MobileImg src={mobileSrc ?? src} />
            ) : (
                <DesktopImage src={src} />
            )}
            <PreviewIcon />
        </PreviewImageWrapper>
    );
};

Preview.propTypes = {
    isMobile: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
    mobileSrc: PropTypes.string,
};

export default withGetScreen(Preview, { mobileLimit: 768 });
