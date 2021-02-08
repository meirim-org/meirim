import React from "react";
import MUICircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

const CircularWrapper = styled.div`
    display: grid;
    justify-content: center;
    padding-top: 40%;
`;

const CircularProgress = () => {
    return (
        <CircularWrapper>
            <MUICircularProgress />
        </CircularWrapper>
    );
};

export default CircularProgress;
