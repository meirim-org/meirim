import React, { Component } from 'react';
import api from '../services/api';
import Wrapper from '../components/Wrapper';
import TreeMap from '../pages/TreeMap';
import {MapProvider} from "react-map-gl";

class TreePermitsMap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			geojson: null,
		};
		this.loadTrees = this.loadTrees.bind(this);
	}


	loadTrees() {
		this.setState({
			noData: false
		});

		api.get(
			'/trees/geojson'
		)
			.then(result => {
				this.setState({
					geojson: result.data
				});
			})
			.catch(error => this.setState({ error }));
	}


	componentDidMount() {
		this.loadTrees();
	}

	render() {
		const { geojson } = this.state;
        
		return (
			<Wrapper>
                <MapProvider>
                    <TreeMap geojson={geojson}/>
                </MapProvider>
			</Wrapper>
		);
	}
}

export default TreePermitsMap;
