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
		const { pageNumber, filterPlaces } = this.state;
		this.loadTrees(pageNumber + 1, filterPlaces);
	}

	componentDidMount() {
		const { pageNumber, filterPlaces } = this.state;

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
				<SharedTypography
					className="trees-helper-title"
					component="span"
					variant="planTitle"
					mobileVariant="cardTitle"
					color="#270E78"
				>
					{t.treesHelperTitle}
				</SharedTypography>
				<SharedTypography
					className="trees-helper-text"
					component="span"
					variant="largeParagraphText"
					mobileVariant="paragraphText"
					color="#000000"
				>
					{t.treesHelperTextA}
					<SharedLink text={t.treesHelperTextLink} url={treeAppealGuideUrl} textDecoration="none" target="_blank" rel="noopener noreferrer"/>
					{t.treesHelperTextB}
				</SharedTypography>
				<div className="container">
					<FilterAutoCompleteMultiple
					    id="trees-search-input"
						classes=""
						placeholder="לדוגמה: נהריה"
						inputSuggestions={treePlaces}
						onFilterChange={this.handlePlaceFilterChange.bind(
							this
						)}
					/>
					<Typography
						component="span"
						variant="subtitle1"
						color="textSecondary"
					>
						{`* ישנן רשויות שלא זמינות לנו כרגע. תמכו בנו כדי שנוכל להגיע גם לעיר שלכם!`}
					</Typography>
					<div>  </div>
					<br />
					<Grid container spacing={4}>
						{treePermits.map(tree => (
							<Grid item xs={12} sm={6} md={4}>
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
													hideZoom={true}
													disableInteractions={true}
													countyName={tree.place}
													title2={timeToObjectionText(tree.start_date)}
													maxZoom={16}
													showPlaceholder={true}
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
							</Grid>
						))}
					</Grid>

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
