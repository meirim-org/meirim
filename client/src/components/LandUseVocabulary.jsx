import React, { Component } from 'react';
import _ from 'lodash';
import stringSimilarity from 'string-similarity';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Chip from '@material-ui/core/Chip';

import terms from '../assets/keywords';

import './LandUseVocabulary.css';

class LandUseVocabulary extends Component {
  
	render() {
		const { landUseJoined } = this.props;
		
		return  landUseJoined.split(',').map(use=>this.renderUse(use));
	}
	renderUse(use) {
		const useTerms = this.finduse(use);

		if (!useTerms || !useTerms.length >0)
			return <Chip label={use}></Chip>;

		return <OverlayTrigger
			key={use}
			overlay={
				<Tooltip id={`tooltip-${use}`}>
					{
						useTerms.map(u=>{
							return <span className="landUseTooltip">
								<strong className="landUseTooltip">{u.title}</strong> 
								{u.description}
							</span>;
						})
					}
				</Tooltip>
			}>
			<Chip label={use} className="chippi"/>
		</OverlayTrigger>;
	}

	finduse(useName){
		return _.filter(terms, t=>{
			return _.find(t.aliases, a=>{
				return stringSimilarity.compareTwoStrings(a, useName) >(1-(1/a.length));  
			});
		});
	}
}

export default LandUseVocabulary;
