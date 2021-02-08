import React from "react";
import * as SC from "./style";
import { ShareTree } from "./components";

const Navigation = () => {
    return (
        <SC.Navigation>
            <ShareTree />
        </SC.Navigation>
    );
};

Navigation.propTypes = {};

export default Navigation;
