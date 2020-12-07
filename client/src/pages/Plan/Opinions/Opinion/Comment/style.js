import styled from "styled-components";
import SubdirectoryArrowLeftRoundedIcon from '@material-ui/icons/SubdirectoryArrowLeftRounded';
import {withTheme} from "@material-ui/core/styles";

export const CommentBox = styled.div`
    padding: 2rem 3.75rem 1rem 2rem;
`;

export const Header = styled.div`
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



export const Text = styled.div`
`;

