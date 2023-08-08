import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { TabPanel } from 'shared';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import {
	FormControl as MuiFormControl,
	FormControlLabel as MuiFormControlLabel,
	RadioGroup as MuiRadioGroup,
	TextareaAutosize as MuiTextareaAutosize,
} from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';

export const CommentsWrapper = withTheme(styled.div`
    grid-column-start: span 2;
`);

export const AddSubComment = withTheme(styled.div`
    grid-area: add-comment;
    padding: 1rem;
    text-align: center;

    .MuiSvgIcon-root {
        font-size: 1.125rem !important;
        fill: ${(props) => props.theme.palette.primary['600']} !important;
        margin: 0 0.75rem;
    }

    .MuiButton-label {
        font-weight: 300;
        font-size: 14px;
        padding: 0.4rem 0 0.4rem 0.75rem;
        border-radius: 200px;
    }

    &.active .MuiButton-label {
        background-color: ${(props) =>
		props.theme.palette.gray['bg']} !important;
    }
`);

export const NoComments = styled.div`
    text-align: center;
`;

export const NoCommentsBold = styled.span`
    font-size: 1.125rem;
    font-weight: 600;
`;

export const NoCommentsRegular = styled.span`
    font-size: 1rem;
`;

export const NewCommentTabPanel = withTheme(styled(TabPanel)`
    &.no-comments {
        margin-bottom: 5.8rem;
    }
`);

export const ButtonWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;

export const NewCommentControl = withTheme(styled(MuiFormControl)`
    .MuiTypography-root {
        font-family: ${(props) => props.theme.fontFamily} !important;
        font-size: 0.875rem;
        color: ${(props) => props.theme.palette.black} !important;
    }

    .MuiRadio-colorSecondary {
        color: ${(props) => props.theme.palette.gray['main']} !important;

        &.Mui-checked {
            color: ${(props) => props.theme.palette.primary['700']} !important;
        }
    }

    textarea {
        border-color: ${(props) => props.theme.palette.primary.main} !important;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
`);

export const addCommentButtonWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;

    &.active {
        margin-bottom: 0;
    }
`;

export const RadioGroup = withTheme(styled(MuiRadioGroup)`
    margin: 0 -0.5rem;
`);

export const NewCommentLabelWrapper = withTheme(styled.div`
    padding: 0 0.5rem;

    .MuiButtonBase-root {
        background-color: transparent !important;
        padding: 0.187rem 0.375rem;
    }
`);

export const ErrorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, calc(-50% - 0.5rem));
    padding: 0 1rem;
`;

export const TextareaAutosize = withTheme(styled(MuiTextareaAutosize)`
    &[disabled] {
        border-color: ${(props) => props.theme.palette.gray['300']} !important;
        background-color: ${(props) => props.theme.palette.white} !important;
    }

    &:focus {
        outline: 0;
    }
`);

export const NewCommentLabel = withTheme(styled(MuiFormControlLabel)`
    border-radius: 4px;
    border: 1px solid transparent;
    margin: 0 0 1rem !important;
    padding: 0 0.35rem 0 1rem;

    .MuiSvgIcon-root {
        width: 0.7em;
        height: 0.7em;
    }

    transition: 0.3s;

    &.active,
    &:hover {
        background-color: ${(props) =>
		props.theme.palette.gray['radio']} !important;
    }

    &.error {
        border-color: ${(props) => props.theme.palette.red.main} !important;
    }
`);

export const Like = withTheme(styled.div`
    grid-column-start: span 1;
    padding: 1rem;
    text-align: center;
    position: relative;

    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    border-top: 1px solid ${(props) => props.theme.palette.gray['300']};
    border-bottom: 1px solid ${(props) => props.theme.palette.gray['300']};
    margin-right: 40px;

    .MuiBadge-badge {
        position: relative;
        transform: none;
        font-weight: 300;
        color: ${(props) => props.theme.palette.black} !important;
        background-color: ${(props) =>
		props.theme.palette.gray['200']} !important;
        font-size: 14px !important;

        width: 24px;
        height: 24px;
        border-radius: 360px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .MuiButton-label {
        font-weight: 300;
        font-size: 14px;
        gap: 8px;
        align-items: center;
    }

    .MuiSvgIcon-root {
        margin: 0 0.75rem;
        font-size: 1.125rem !important;
    }
`);

export const LikeIcon = withTheme(styled(ThumbUpAltOutlinedIcon)`
    font-size: 1.15em !important;
    fill: ${(props) => props.theme.palette.primary['600']} !important;
`);
