import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SubdirectoryArrowLeftRoundedIcon from '@material-ui/icons/SubdirectoryArrowLeftRounded';

export const Header = styled.span`
    grid-column-start: span 2;
    padding: 2rem 2rem 0;
    margin-bottom: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -1rem 0.8rem;
`;

export const CommentsWrapper = withTheme(styled.div`
    grid-area: comments;
    border-top: 1px solid ${(props) => props.theme.palette.gray['300']};
`);

export const FirstSide = withTheme(styled.div`
    > * {
        padding: 0 1rem;
        position: relative;

        &:not(:last-child):after {
            content: '|';
            position: absolute;
            color: ${(props) => props.theme.palette.gray['300']};
            left: 0;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
`);

export const SecondSide = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;

    > * {
        color: #666666 !important;
    }
`;

export const Text = withTheme(styled.div`
    grid-column-start: span 2;
    padding: 16px 40px 8px;
    margin: 0;
    // border-bottom: 1px solid ${(props) => props.theme.palette.gray['300']};

    //@media screen and (max-width: 345px) {
    //    padding: 16px 40px 8px;
    //}

    color: #000;
    text-align: right;
    font-feature-settings: 'clig' off, 'liga' off;
    /* Default Text 16 */
    font-family: Assistant, sans-serif;
    font-size: 16px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 24px !important; /* 150% */
`);

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;

export const addSubCommentWrapper = styled.div`
    padding: 2rem 3.5rem;
`;

export const ButtonWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const addCommentButtonWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;

    &.active {
        margin-bottom: 0;
    }
`;

export const SubCommentBox = withTheme(styled.div`
    background-color: ${(props) => props.theme.palette.white} !important;
    padding: 2rem 60px 24px 40px;
`);

export const SubCommentHeader = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    & > div {
        padding-right: 0;
        margin-right: -24px;
    }
`;

export const ArrowIcon = withTheme(styled(SubdirectoryArrowLeftRoundedIcon)`
    position: absolute;
    font-size: 1rem !important;
    right: 0;
    transform: translate(100%, -50%);
    top: 50%;
    fill: ${(props) => props.theme.palette.secondary['600']} !important;
`);

export const StatusAndTypeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem 1rem;
`;

export const EntryContent = withTheme(styled.div`
    font-family: ${(props) => props.theme.fontFamily} !important;
    font-size: 16px;
    line-height: 1.5;
    color: ${(props) => props.theme.palette.black} !important;
`);

export const SubscribeIconWrapper = withTheme(styled.div`
    background-color: ${(props) => props.theme.palette.white};
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    padding: 8px;
    margin: 0 auto 0.75rem;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);

    svg {
        position: absolute;
        fill: ${(props) => props.theme.palette.primary.main} !important;
    }
`);

export const SubscribeTextWrapper = styled.div`
    text-align: center;
    margin-bottom: 1.25rem;
`;
