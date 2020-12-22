import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import LinkIcon from '@material-ui/icons/Link';
import CloseIcon from '@material-ui/icons/Close';
import SubdirectoryArrowLeftRoundedIcon from '@material-ui/icons/SubdirectoryArrowLeftRounded';
import { 
	FormControl as MuiFormControl,
	FormControlLabel as MuiFormControlLabel,
	RadioGroup as MuiRadioGroup,
	TextareaAutosize as MuiTextareaAutosize,

} from '@material-ui/core';
import { TabPanel } from 'shared';


export const Header = styled.span`
    grid-area: header; 
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
    grid-area: text; 
    padding: 0 2rem 1rem;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.palette.gray['300']};
`);

export const Like = withTheme(styled.div`
    grid-area: like; 
    padding: 1rem;
    text-align: center;
    position: relative;

    .MuiBadge-badge {
        position: relative;
        margin-right: .25rem;
        transform: none;
        font-weight: 300;
        color: ${props => props.theme.palette.black} !important;
        background-color: ${props => props.theme.palette.gray['200']} !important;
        font-size: 14px !important;
        padding: 0.6rem;
    }
    
    .MuiButton-label {
       font-weight: 300;
       font-size: 14px;
    }
    
   .MuiSvgIcon-root {
       margin: 0 0.75rem; 
       font-size: 1.125rem !important;
    }
    
    &:after {
        content: '';
        position: absolute;
        background-color: ${props => props.theme.palette.gray['300']};
        left: 0;
        top: 50%;
        height: 100%;
        width: 1px;
        transform: translate(-50%,-50%);
    }

`);

export const AddSubComment = withTheme(styled.div`
    grid-area: add-comment;
    padding: 1rem; 
    text-align: center;
    .MuiSvgIcon-root {
        font-size: 1.125rem !important;
        fill: ${props => props.theme.palette.primary['600']} !important;  
        margin: 0 0.75rem; 
    }
    
    .MuiButton-label {
        font-weight: 300;
        font-size: 14px;
        padding: .4rem 0 .4rem .75rem;
        border-radius: 200px;
    }
    
   &.active .MuiButton-label{
        background-color: ${props => props.theme.palette.gray['bg']} !important; 
    }
    
`);

export const LikeIcon = withTheme(styled(ThumbUpAltOutlinedIcon)`
    font-size: 1.15em !important;
    fill: ${props => props.theme.palette.primary['600']} !important;  
`);

export const CommentIcon = styled(ChatBubbleOutlineIcon)`
    font-size: 1rem !important;
`;


export const FormControl = withTheme(styled(MuiFormControl)`
    margin-bottom: 1rem !important;
    textarea {
        width: 100%;
        padding: 1rem;
        border-radius: 4px;
        border-color: ${props => props.theme.palette.gray['600']} !important;  
        
        &:focus {
            outline-color: ${props => props.theme.palette.primary['600']} !important;
        }
    }   
`);

export const addSubCommentButtonWrapper = styled.div`
    margin: 0 -.6rem;
    display: flex;
    justify-content: flex-end;
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

export const ErrorWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, calc(-50% - .5rem));
    padding: 0 1rem;
`;


export const NewCommentControl = withTheme(styled(MuiFormControl)`
    .MuiTypography-root {
        font-family:  ${props => props.theme.fontFamily} !important;
        font-size: 0.875rem;
        color: ${props => props.theme.palette.black} !important;
    }
    .MuiRadio-colorSecondary {
        color: ${props => props.theme.palette.gray['main']} !important;
        &.Mui-checked {
            color: ${props => props.theme.palette.primary['700']} !important;
        }
    }
    
    textarea {
        border-color: ${props => props.theme.palette.primary.main} !important;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
    }   
`);

export const NewCommentTabPanel = withTheme(styled(TabPanel)`
    &.no-comments {
        margin-bottom: 5.8rem;
    }
`);

export const NewCommentLabel = withTheme(styled(MuiFormControlLabel)`
    border-radius: 4px;
    border: 1px solid transparent;
    margin: 0 0 1rem !important;
    padding: 0 .35rem 0 1rem;
    transition: .3s;
    &.active, &:hover {
        background-color: ${props => props.theme.palette.gray['radio']} !important;
    }  
    &.error {
        border-color: ${props => props.theme.palette.red} !important;;
    }
`);

export const RadioGroup = withTheme(styled(MuiRadioGroup)`
    margin: 0 -.5rem;
`);

export const NewCommentLabelWrapper = withTheme(styled.div`
    padding: 0 .5rem;
    
    .MuiButtonBase-root {
        background-color: transparent !important;
        padding: 0.187rem 0.375rem;
    }
`);

export const TextareaAutosize = withTheme(styled(MuiTextareaAutosize)`
    &[disabled] {
        border-color: ${props => props.theme.palette.gray['300']} !important;
        background-color: ${props => props.theme.palette.white} !important;
    }
`);

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


export const PlanSummaryTitleWrapper = styled.div`
    margin-bottom: .75rem;
`;

export const PlanTermsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.25rem .75rem;
`;

export const PlanTermWrapper = withTheme(styled.div`
    padding: .25rem;
    > .MuiChip-root {
        height: auto;
        min-height: 1.875rem;
        color: ${props => props.theme.palette.green['text']} !important;  
        background-color: ${props => props.theme.palette.green['bg']} !important;  
    }
`);

export const StatusAndTypeWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.5rem 1rem;
`;

export const StatusWrapper = styled.div`
    padding: 0 0.5rem
`;

export const TypeWrapper = styled.div`
    padding: 0 0.5rem
`;

export const UrlWrapper = styled.div``;

export const CustomLinkIcon = withTheme(styled(LinkIcon)`
    fill: ${props => props.theme.palette.secondary.main} !important;  
    vertical-align: middle;
    margin-right: .5rem;
`);

export const EntryContent = withTheme(styled.div`
    font-family:  ${props => props.theme.fontFamily} !important;
    font-size: 16px;
    line-height: 1.5;
    color: ${props => props.theme.palette.black} !important;  
`);

export const SemiBold = styled.span`
    font-weight: 600;
`;


export const ChartWrapper = styled.div`
    height: 200px;
    margin-top: 1rem;
`;

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
        fill: ${props => props.theme.palette.primary.main} !important;  
    }
`);

export const SubscribeTextWrapper = styled.div`
    text-align: center;
    margin-bottom: 1.25rem;
`;

export const SubscribeButtonsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0 -.75rem;
`;

export const SubscribeButtonWrapper = styled.div`
    padding: 0 .75rem;
`;

export const CloseSubscribeIcon = withTheme(styled(CloseIcon)`
    position: absolute;
    top: .5rem;
    right: .5rem;
    cursor: pointer;
    font-size: 1.3rem !important;
    fill: ${props => props.theme.palette.black} !important;  
    opacity: .8;
`);

export const MapWrapper = withTheme(styled.div`
    height: 8.875rem;
    border-radius: 4px;
    border: solid 1px ${props => props.theme.palette.gray['450']};
    
    > div {
        border-radius: 4px;
    }
`);


