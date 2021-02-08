import React from "react";
import PropTypes from "prop-types";
import Mapa from "components/Mapa";
import Wrapper from "components/Wrapper";
import { CommentSelectors, PlanSelectors } from "redux/selectors";
import { Header } from "./containers";
import Footer from "components/Footer";
import * as SC from "./style";

const Template = ({
    children,
    match,
    subscriptionHandler,
    newCommentViewHandler,
    isFavPlan,
}) => {
    const { comments } = CommentSelectors();
    const {
        planData: { geom },
    } = PlanSelectors();
    const isPlanHaveComments = comments.length > 0;

    return (
        <Wrapper hideFooter={true}>
            <SC.MainWrapper>
                <SC.Content>
                    <Header
                        newCommentViewHandler={newCommentViewHandler}
                        subscriptionHandler={subscriptionHandler}
                        isFavPlan={isFavPlan}
                        match={match}
                    />
                    <SC.Main
                        className={!isPlanHaveComments ? "no-comments" : ""}
                    >
                        {children}
                    </SC.Main>
                    <Footer />
                </SC.Content>
                <Mapa
                    geom={geom}
                    hideZoom={false}
                    disableInteractions={false}
                />
            </SC.MainWrapper>
        </Wrapper>
    );
};

Template.propTypes = {
    newCommentViewHandler: PropTypes.func.isRequired,
    setCommentState: PropTypes.func.isRequired,
    subscriptionHandler: PropTypes.func.isRequired,
    isFavPlan: PropTypes.bool.isRequired,
    children: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default Template;
