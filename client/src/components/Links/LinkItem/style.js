import styled from 'styled-components';
import { colors, device, font } from '../../../style';

export const LinkItemWrapper = styled.div`
    padding: 16px;
    border-radius: 12px;
    background: ${colors.grey[100]};
    display: flex;
    gap: 16px;
    flex-direction: column;
    justify-content: space-between;

    @media screen and ${device.laptop} and (max-width: 1200px) {
        gap: 10px;
    }

    @media ${device.tablet} {
    }
    @media ${device.laptop} {
    }
`;

export const LinkItemGeneral = styled.div`
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    @media screen and ${device.laptop} and (max-width: 1200px) {
        gap: 10px;
    }
`;

export const LinkItemTitle = styled.div`
    font-family: ${font.assistant}, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
    color: ${colors.purple[700]};
    margin-bottom: 8px;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-top: -7px;
    @media screen and ${device.laptop} and (max-width: 1200px) {
        font-size: 13px;
        line-height: 18px;
        margin-bottom: 6px;
    }
`;

export const LinkItemText = styled.div`
    font-family: ${font.assistant}, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    color: ${colors.purple[700]};
    line-clamp: 3;
    -webkit-line-clamp: 3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    @media screen and ${device.laptop} and (max-width: 1200px) {
        font-size: 13px;
        line-height: 16px;
    }
`;

export const LinkItemIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 48px;
    max-height: 48px;
    width: 100%;
    height: 100%;

    img {
        max-width: 100%;
    }

    @media screen and ${device.laptop} and (max-width: 1200px) {
        max-width: 40px;
        max-height: 40px;
    }
`;

export const LinkItemAction = styled.div`
    a {
        background: #ffffff;
        border: 1px solid ${colors.purple[500]};
        border-radius: 4px;
        padding: 4px 12px;
        font-family: ${font.assistant}, sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: ${colors.purple[500]};
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
`;
