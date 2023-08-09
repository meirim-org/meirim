import styled from 'styled-components';
import { colors, device, font } from '../../style';
import { withTheme } from '@material-ui/core/styles';

export const UserProfileBox = styled.div`
    font-family: ${font.assistant}, sans-serif;
    width: 478px;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-style: normal;
    text-align: center;
`;

export const UserProfileAvatarBox = styled.div`
    width: 152px;
    height: 152px;
    border-radius: 360px;
    position: relative;
    margin-bottom: 8px;
`;

export const UserProfileName = withTheme(styled.div`
    color: ${(props) => props.theme.palette.text['main']};
    font-size: 28px;
    font-weight: 700;
    line-height: 28px;
`);

export const UserProfileType = withTheme(styled.div`
    color: #6d6277;
    font-size: 20px;
    font-weight: 600;
    line-height: 27px;
    margin-bottom: 8px;
`);

export const UserProfileContent = withTheme(styled.div`
    width: 100%;
    background-color: #efefef;
    padding: 32px;
    box-sizing: border-box;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
`);

export const UserProfileTitle = withTheme(styled.div`
    color: ${(props) => props.theme.palette.text['main']};
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    margin-bottom: 8px;
`);

export const UserProfileAboutMe = styled.div`
    color: #222;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
`;

export const UserProfileSocials = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: row-reverse;
    margin-bottom: 23px;
`;

export const UserProfileSocial = withTheme(styled.a`
    width: 32px;
    height: 32px;
    background: ${() => colors.purple[500]};
    box-sizing: border-box;
    border-radius: 360px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
`);

export const UserProfileAvatar = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 360px;
`;

export const UserProfileVerified = styled.img`
    position: absolute;
    right: 10px;
    width: 32px;
    height: 32px;
    bottom: 5px;
`;
