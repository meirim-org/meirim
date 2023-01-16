import React, { Component } from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link as SharedLink, Typography as SharedTypography } from 'shared';

import api from "../services/api";

import Wrapper from "../components/Wrapper";
import Mapa from "../components/Mapa";
import FilterAutoCompleteMultiple from "../components/FilterAutoCompleteMultiple";

import { treeAppealGuideUrl } from '../pages/Tree/constants';
import t from "../locale/he_IL";
import "./TreePermits.css";
import { timeToObjectionText } from '../pages/Tree/utils';
import TreeMap from "../pages/TreeMap";

class TreePermitsMap extends Component {
	state = {
        geojson: null,
    };

	constructor(props) {
		super(props);

		this.loadTrees = this.loadTrees.bind(this);
	}


	loadTrees() {
		this.setState({
			noData: false
		});

		api.get(
			"/trees/geojson"
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
                <h1>TEST</h1>
                <TreeMap geojson={geojson}/>
			</Wrapper>
		);
	}
}

export default TreePermitsMap;
