

import React, {Component} 						from 'react';
import PropTypes 								from 'prop-types';
import { connect }                              from 'react-redux'
import loginActions                              from '../../redux/actions/loginActions';
import LoginForm                                from '../LoginForm/LoginForm';
import { Form}                                  from 'antd';

class LoginContainer extends Component {

    constructor(props){
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(values) {

    }

    render() {
        const WrappedNormalLoginForm = Form.create()(LoginForm);

        return (
            <div className='signin-container content-main-center'>
                <WrappedNormalLoginForm onSubmit={this.onSubmit}
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
       // onLoginSubmit: (loginForm) => { return dispatch (loginActions.login(loginForm))},
    }
};

var mapStateToProps = function(state){
    return {
        response:  state.loginReducer.response,
    }
};

export default connect(LoginContainer, mapStateToProps, mapDispatchToProps);