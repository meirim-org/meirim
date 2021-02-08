import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import { BottomNavigation } from "@material-ui/core";

export const Navigation = withTheme(styled(BottomNavigation)`
    position: fixed;
    z-index: 9999;
    bottom: 0;
    width: 100vw;
    border-top: 1px solid ${(props) => props.theme.palette.gray["300"]};
    height: 3.75rem !important;
    path {
        color: ${(props) => props.theme.palette.primary.main};
    }
    .MuiButtonBase-root {
        max-width: 103px !important;
        padding: 0.375rem 0.75rem !important;
        .MuiSvgIcon-root {
            margin-bottom: 0.15rem;
        }
        .MuiBottomNavigationAction-label {
            font-family: ${(props) => props.theme.fontFamily} !important;
            opacity: 1 !important;
        }
        .MuiBottomNavigationAction-wrapper {
            padding-top: 0.25rem;
        }
        &:focus {
            outline: none;
        }
    }
`);
