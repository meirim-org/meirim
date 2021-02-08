import styled from "styled-components";
import { Button as MuiButton } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";

export const Button = withTheme(styled(MuiButton)`
    &.MuiButton-containedPrimary {
        transition: none !important;
        &.active {
            border-color: ${(props) =>
                props.theme.palette.secondary.main} !important;
            background-color: ${(props) =>
                props.theme.palette.secondary["active"]} !important;
        }
    }
`);
