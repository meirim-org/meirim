import React, { Component } from "react";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import InfiniteScroll from "react-infinite-scroll-component";

import api from "../services/api";

import Wrapper from "../components/Wrapper";
import Mapa from "../components/Mapa";
import FilterAutoCompleteMultiple from "../components/FilterAutoCompleteMultiple";

import t from "../locale/he_IL";
import "./TreePermits.css";

const DAY_IN_MILISECONDS = 1000 * 60 * 60 *24;

class TreePermits extends Component {
	state = {
		error: false,
		hasMore: true,
		noData: false,
		pageNumber: 1,
		places: [],
		filterPlaces: [],
		treePermits: []
	};

	constructor(props) {
		super(props);

		this.loadTrees = this.loadTrees.bind(this);
		this.loadNextPage = this.loadNextPage.bind(this);
	}

	handlePlaceFilterChange(selectedPlaces) {
		this.setState({
			treePermits: []
		});

		this.loadTrees(1, selectedPlaces);
	}

	CardContentAddress(props) {
		const { street, street_number } = props.tree;
		let address = 'לא מצוין'
		if (street && street_number) {
			address = `${street} ${street_number}`;
		}
		else if (street) {
			address = `${street}`;
		}
		return (
				<Typography component="p" color="textPrimary"> <strong>כתובת: </strong>{address}</Typography>
		)
	};

	CardContentField(props) {
		const {field, fieldBold} = props;
		const text = field || 'לא מצוין' 
	return 	<Typography component="p" color="textPrimary"> <strong>{fieldBold} </strong>{text}</Typography>
	}

	timeToObjectionText(start_date) {
		const permitStartDate = new Date(start_date);
		const now = new Date();
		const timeLeft = (permitStartDate.getTime() - now.getTime() > 0)?  Math.floor((permitStartDate - now) / DAY_IN_MILISECONDS ) : -1; 
		if (timeLeft == -1) { return 'בתוקף';}
		else if (timeLeft == 0) { return `יום אחרון`}
		else if (timeLeft == 1) { return `נותר יום אחד`}
		else return  `נותרו ${timeLeft} ימים`;
	}

	loadTrees(pageNumber, filterPlaces) {
		this.setState({
			noData: false
		});

		api.get(
			"/tree?page=" +
			pageNumber +
			"&PLACE=" +
			filterPlaces.join(",")
		)
			.then(result => {
				this.setState({
					hasMore:
						result.pagination.page < result.pagination.pageCount,
					noData: this.state.treePermits.length + result.data.length === 0,
					pageNumber,
					filterPlaces,
					treePermits: [...this.state.treePermits, ...result.data]
				});
			})
			.catch(error => this.setState({ error }));
	}

	loadNextPage() {
		const { pageNumber, filterPlaces: filterPlaces } = this.state;
		this.loadTrees(pageNumber + 1, filterPlaces);
	}

	componentDidMount() {
		const { pageNumber, filterPlaces: filterPlaces } = this.state;

		api.get("/tree_place")
			.then(result => {
				this.setState({
					treePlaces: result.data.map(tree_place => {
						return { label: tree_place.place };
					})
				});
			})
			.catch(error => this.setState({ error }));

		this.loadTrees(pageNumber, filterPlaces);
	}

	render() {
		const { treePermits, treePlaces, error, noData, hasMore } = this.state;
		const { me } = this.props;

		return (
			<Wrapper me={me}>
				<div className="container">
					<FilterAutoCompleteMultiple
						classes=""
						placeholder="הזינו עיר, מועצה אזורית או רשות מקומית "
						inputSuggestions={treePlaces}
						onFilterChange={this.handlePlaceFilterChange.bind(
							this
						)}
					/>
					<br />
					<GridList
						cellHeight={500}
						cellWidth={335}
						className="gridList"
						cols={1}
					>
						{treePermits.map(tree => (
							<Card className="card" raised={true} key={tree.id}>
								<Link
									className="card-link"
									to={`/tree/${tree.id}`}
								>
									<CardActionArea className="card-action-area">
										<CardMedia
											className="card-media"
										>
											<Mapa
											
												geom={tree.geom}
												placeholder="/images/cutting_tree.jpg"
												hideZoom={true}
												disableInteractions={true}
												title={tree.place}
												title2={this.timeToObjectionText(tree.start_date)}
											/>
										</CardMedia>
										<CardContent className="card-content">
											<Typography
												gutterBottom
												variant="h5"
												component="h2"
												color="textPrimary"
											>
												{`מספר העצים: ${tree.total_trees}`}
											</Typography>
											<this.CardContentAddress tree={tree} />
											<this.CardContentField field={tree.action} fieldBold='פעולה:'/>
											<this.CardContentField field={tree.reason_short} fieldBold='סיבה:' />
										</CardContent>
									</CardActionArea>
								</Link>	
							</Card>
						))}
					</GridList>

					{error && <div className="error-container">{error}</div>}
					{noData && <div>אין כאן כלום</div>}
				</div>
				<InfiniteScroll
					dataLength={treePermits.length}
					next={this.loadNextPage}
					hasMore={hasMore}
					loader={<h4 className="centerNote">{t.loading}</h4>}
					endMessage={
						<p className="centerNote">
							<b>{t.seenAllPlans}</b>
						</p>
					}
				/>
			</Wrapper>
		);
	}
}

export default TreePermits;
