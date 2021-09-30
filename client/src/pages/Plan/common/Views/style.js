import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SubdirectoryArrowLeftRoundedIcon from '@material-ui/icons/SubdirectoryArrowLeftRounded';
import { colors } from 'style';

export const Header = styled.span`
    grid-column-start: span 2;
    padding: 2rem 2rem 0;
    margin-bottom: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -1rem .8rem;
`;

export const CommentsWrapper = withTheme(styled.div`
    grid-area: comments; 
    border-top: 1px solid ${props => props.theme.palette.gray['300']};
`);

export const FirstSide = withTheme(styled.div`
    > * {
        padding: 0 1rem;
        position: relative;
        &:not(:last-child):after {
            content: '|';
            position: absolute;
            color: ${props => props.theme.palette.gray['300']};
            left: 0;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
`);

export const SecondSide = styled.div`
    > * {
        padding: 0 1rem;
    }
`;

export const Text = withTheme(styled.div`
    grid-column-start: span 2;
    padding: 0 2rem 1rem;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
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
    background-color: ${props => props.theme.palette.white} !important;  
    padding: 2rem 3.75rem 1rem 2rem;
`);

export const SubCommentHeader = styled.div`
    position: relative;
    display: flex;
    margin: 0 -.5rem .5rem;
    > *:not(svg) {
        padding: 0 .5rem;
    }
`;

export const ArrowIcon = withTheme(styled(SubdirectoryArrowLeftRoundedIcon)`
    position: absolute;
    font-size: 1rem !important;
    right: 0;
    transform: translate(100%, -50%);
    top: 50%;
    fill: ${props => props.theme.palette.secondary['600']} !important;  
`);


export const StatusAndTypeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.5rem 1rem;
`;


export const EntryContent = withTheme(styled.div`
    font-size: 16px;
    line-height: 1.5;
    color: ${props => props.theme.palette.black} !important;  
`);

export const SubscribeIconWrapper = withTheme(styled.div`
    background-color: ${props => props.theme.palette.white};
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    padding: 8px;
    margin: 0 auto .75rem;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
    svg {
        position: absolute;
        fill: ${colors.purple[500]} !important;  
    }
`);

export const SubscribeTextWrapper = styled.div`
    text-align: center;
    margin-bottom: 1.25rem;
`;

