
import React, { Component } from 'react';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import api from '../services/api';

import t from '../locale/he_IL';

class SinglePlan extends Component {
  state = {
    plan : {}
  }
  
  componentDidMount() {
    const { id } = this.props.match;
    return api
    .get('/plan/'+id)
    .then(plan => this.setState({plan}))
    .catch(error => this.setState({error}))
}

render() {
    const {alerts, form, error, loading} = this.state;
    const {me} = this.props;

    return <React.Fragment>
        <Navigation me={me}/>
        <div className="container">
            
        </div>
        <Footer/>
    </React.Fragment>
}
}

export default SinglePlan;
