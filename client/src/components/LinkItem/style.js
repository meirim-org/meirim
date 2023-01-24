import styled from 'styled-components';
import { colors, device, font } from '../../style';

export const LinkItemWrapper = styled.div`
    padding: 16px;
    border-radius: 12px;
    background: ${colors.grey[100]};
    display: flex;
    gap: 16px;
    align-items: flex-start;
    max-width: calc(50% - 8px);
    flex: 1 1 calc(50% - 8px);

    @media ${device.tablet} {
    }
    @media ${device.laptop} {
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
`;

export const LinkItemText = styled.div`
    font-family: ${font.assistant}, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    color: ${colors.purple[700]};
    margin-bottom: 16px;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
`;

export const LinkItemIcon = styled.div`
    padding: 10px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.color};
    max-width: 48px;
    max-height: 48px;
    width: 100%;
    height: 100%;

    img {
        max-width: 100%;
    }
`;

export const LinkItemAction = styled.div`
    a {
        background: #ffffff;
        border: 1px solid ${colors.purple[500]};
        border-radius: 4px;
        padding: 4px 12px;
        text-align: center;
        font-family: ${font.assistant}, sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: ${colors.purple[500]};
    }
`;
