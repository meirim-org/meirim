import { withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';

export const HeaderPersonVerified = styled.img`
    position: absolute;
    right: ${(props) => props.right || '15px'};
    bottom: 0;
    @media screen and (max-width: 767px) {
        right: 0;
    }

    &:hover {
        & + div {
            opacity: 1;
        }
    }
`;

export const HeaderAvatarBox = withTheme(styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: ${(props) => (props.mode !== 'subComment' ? '16px' : '0px')};
    margin-right: ${(props) => (props.mode !== 'subComment' ? '0' : '-24px')};
    position: relative;

    cursor: pointer;

    @media screen and (max-width: 767px) {
        padding-right: 0;
    }

    .HeaderPersonType {
        color: #222222;
        font-weight: 300;
        border-bottom: 1px solid transparent;
        transition: 0.5s;
    }

    .UserName {
        border-bottom: 1px solid transparent;
        transition: 0.5s;
    }

    .UserAvatar {
        width: 44px;
        height: 44px;
        border-radius: 360px;
        border: 1px solid ${(props) => props.theme.palette.gray['300']};

        img {
            width: 100%;
            height: 100%;
            border-radius: 360px;
            transition: 0.5s;
        }
    }

    &:hover {
        .UserAvatar img {
            filter: brightness(0.75);
            transition: 0.5s;
        }

        .HeaderPersonType,
        .UserName {
            border-bottom: 1px solid
                ${(props) => props.theme.palette.text['main']};
        }
    }

    span {
        color: #222 !important;
        text-align: right;
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: Assistant, sans-serif;
        font-size: 14px !important;
        font-style: normal;
        font-weight: 600 !important;
        line-height: normal;
    }
`);

export const HeaderTypeCommentBox = styled.div`
    padding-left: 16px;
    position: relative;

    &:after {
        content: ${(props) => (props.mode !== 'subComment' ? '\'\'' : 'none')};
        position: absolute;
        width: 1px;
        height: 16px;
        background-color: rgba(0, 0, 0, 0.08);
        left: 0;
        top: calc(50% - 8px);
    }

    span {
        color: #007e6c !important;
        text-align: right;
        font-feature-settings: 'clig' off, 'liga' off;
        /* Default Text 16 */
        font-family: Assistant, sans-serif !important;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
    }
`;

export const HeaderCommentContent = styled.div`
    display: flex;
    align-items: center;
    @media screen and (max-width: 767px) {
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
    }
`;

export const HeaderCommentBox = styled.div`
    padding: ${(props) => (props.mode !== 'subComment' ? '40px 40px 0' : '0')};
    position: relative;
    margin: 0;
    margin-bottom: ${(props) => (props.mode !== 'subComment' ? '0' : '16px')};
    grid-column-start: span 2;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    @media screen and (max-width: 345px) {
        padding: 30px 30px 0;
    }
`;

export const HeaderCommentDate = withTheme(styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    position: absolute;
    left: ${(props) => (props.mode !== 'subComment' ? '39px' : '0px')};

    @media screen and (max-width: 345px) {
        left: 31px;
    }

    > * {
        color: ${(props) => props.theme.palette.gray['600']} !important;
    }
`);
