import React, { Component, Fragment } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Wrapper(props) {
    const { me, children } = props;
    return (
        <Fragment>
            <Navigation me={me} />
            {!children ? (
                <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                props.children
            )}
            <Footer />
        </Fragment>
    );
}
