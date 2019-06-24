import React, { Component } from 'react';
import _ from 'lodash'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'

import terms from '../assets/keywords'

import './LandUseVocabulary.css';

class LandUseVocabulary extends Component {
  
  state = {
    usesString: this.props.string,
  };

  render() {
    const { usesString } = this.state;
    // splitting the uses
    let uses = _.split(usesString, ',')
    //return <div dangerouslySetInnerHTML={this.createMarkup(this.state.html)} />;
    return uses.map(use=>this.renderUse(use))
    return 'gal'
  }
  renderUse(use) {
    let useTerm = this.finduse(use);

    if(useTerm && useTerm.description){
        return <OverlayTrigger
            key={use}
            overlay={
            <Tooltip id={`tooltip-${use}`}>
             <strong>{useTerm.title}</strong> <br></br>
              {useTerm.description}
            </Tooltip>
          }
        >
        <Button variant="light">{use}</Button>
      </OverlayTrigger>
    }
    return <Button variant="light" disabled>{use}</Button>
  }


  finduse(useName){
    // getting the use name and searching in keywords
    return _.find(terms, t=>{
      if(!t.aliases) 
        return false;
      return _.indexOf(t.aliases, useName) !== -1
    })
  }
}

export default LandUseVocabulary;
