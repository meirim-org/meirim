import React, { useState } from "react";
import PropTypes from "prop-types";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Wrapper from "components/Wrapper";
import { Header, Navigation } from "./containers";
import * as SC from "./style";
import Footer from "components/Footer";

const Template = ({ children, match }) => {
    const [tabsPanelRef, setTabsPanelRef] = useState(null);
    const [fixedHeader, setFixedHeader] = useState(false);

    let tabsPanelTop =
        tabsPanelRef && tabsPanelRef.current
            ? tabsPanelRef.current.getBoundingClientRect().top
            : null;

    const handleTabsPanelRef = (ref) => setTabsPanelRef(ref);
    const handleFixedHeader = (newValue) => setFixedHeader(newValue);

    // eslint-disable-next-line no-unused-vars
    useScrollPosition(
        ({ prevPos, currPos }) => {
            if (currPos.y < -Math.abs(tabsPanelTop))
                return handleFixedHeader(true);

            return handleFixedHeader(false);
        },
        [tabsPanelRef]
    );

    return (
        <Wrapper hideFooter={true}>
            <SC.MobileMainWrapper>
                <SC.Content>
                    <Header
                        match={match}
                        handleTabsPanelRef={handleTabsPanelRef}
                        fixedHeader={fixedHeader}
                    />
                    <SC.Main>{children}</SC.Main>
                    <Navigation />
                    <Footer />
                </SC.Content>
            </SC.MobileMainWrapper>
        </Wrapper>
    );
};

Template.propTypes = {
    children: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default Template;
