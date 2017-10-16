

import React, {Component} 						from 'react';
import PropTypes 								from 'prop-types';
import { connect }                              from 'react-redux'
import loginActions                              from '../../redux/actions/loginActions';
import LoginForm                                from '../LoginForm/LoginForm';
import { Form, Card}                                  from 'antd';
import 'antd/dist/antd.css';
import '../../Login.css';

class LoginContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            errorMessage: "",
            email: "",
            password: "",
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(values) {
        var loginForm = {
            password: values.password || "",
            email: values.userName
        };

        this.props.onLoginSubmit(loginForm);
    }

    render() {
        const WrappedNormalLoginForm = Form.create()(LoginForm);

        return (
            <div className='signin-container content-main-center'>

                <WrappedNormalLoginForm onSubmit={this.props.onLoginSubmit}
                                        email={this.state.email}
                                        password={this.state.password}
                                        errorMessage={this.props.response}
                />
            </div>
        );
    }
}

LoginContainer.propTypes = {
    response: PropTypes.string,
};

LoginContainer.defaultProps = {
    response: ""
};


var mapDispatchToProps = function (dispatch) {
    return {
        onLoginSubmit: (loginForm) => { return dispatch (loginActions.login(loginForm))},
    }
};

var mapStateToProps = function(state){
    return {
        response:  state.loginReducer.response,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);