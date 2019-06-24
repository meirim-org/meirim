import React, { Component } from 'react';
import _ from 'lodash';
import stringSimilarity from 'string-similarity'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'

import terms from '../assets/keywords'

import './LandUseVocabulary.css';

class LandUseVocabulary extends Component {
  
  state = {
    usesString: this.props.landUseJoined,
  };

  render() {
    const { usesString } = this.state;
    // splitting the uses
    return  usesString.split(',').map(use=>this.renderUse(use))
  }
  renderUse(use) {
    const useTerms = this.finduse(use);

    if(!useTerms || !useTerms.length >0)
      return <Button variant="light" disabled>{use}</Button>
      return <OverlayTrigger
          key={use}
          overlay={
          <Tooltip id={`tooltip-${use}`}>
          {
            useTerms.map(u=>{
              return <span className="landUseTooltip">
                <strong className="landUseTooltip">{u.title}</strong> 
                    {u.description}
                </span>
            })
          }
          </Tooltip>
        }>
          <Button variant="light">{use}</Button>
      </OverlayTrigger>
  }

  finduse(useName){
    return _.filter(terms, t=>{
      return _.find(t.aliases, a=>{
        return stringSimilarity.compareTwoStrings(a, useName) >(1-(1/a.length))  
      })
    })
  }
}

export default LandUseVocabulary;
