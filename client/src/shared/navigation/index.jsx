import React from "react";
import PropTypes from "prop-types";
import { notAuthenticated } from "redux/user/slice";
import { logout } from "services/user";
import { UserSelectors } from "redux/selectors";
import MobileNavBar from "./mobile";
import DesktopNavBar from "./desktop";
import { withGetScreen } from "react-getscreen";
import { useDispatch } from "react-redux";

const Navigation = (props) => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = UserSelectors();

    const logoutHandler = async () => {
        const response = await logout();
        if (response.status === "OK") dispatch(notAuthenticated());
    };

    return (
        <React.Fragment>
            {props.isMobile() || props.isTablet() ? (
                <MobileNavBar
                    logoutHandler={logoutHandler}
                    user={user}
                    isAuthenticated={isAuthenticated}
                />
            ) : (
                <DesktopNavBar
                    logoutHandler={logoutHandler}
                    user={user}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </React.Fragment>
    );
};

Navigation.propTypes = {
    isMobile: PropTypes.func.isRequired,
    isTablet: PropTypes.func.isRequired,
};
export default withGetScreen(Navigation, {
    mobileLimit: 768,
    tabletLimit: 1024,
    shouldListenOnResize: true,
});
