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
import UnsafeRender from "../components/UnsafeRender";
import FilterAutoCompleteMultiple from "../components/FilterAutoCompleteMultiple";

import t from "../locale/he_IL";
import "./Plans.css";

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

    handlePlaceFilterChange(selectedCounties) {
        this.setState({
            treePermits: []
        });

        this.loadTrees(1, selectedCounties);
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
        const { treePermits: treePermits, places: treePlaces, error, noData, hasMore } = this.state;
        const { me } = this.props;

        return (
            <Wrapper me={me}>
                <div className="container">
                    <FilterAutoCompleteMultiple
                        classes=""
                        placeholder="חדש! סינון לפי רשויות מקומיות- הזינו את הרשויות שברצונכם לראות"
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
											title={`כריתה/העתקה של ${tree.number_of_trees} עצים - ${tree.street} ${tree.street_number}` }
											// כריתה והעתקה של 30 עצים ברחוב משה סנה 50, תל אביב
                                        >
                                            <Mapa
                                                geom={{
													"type": "FeatureCollection",
													"features": [
													
													{ "type": "Feature", "properties": { "osm_id": "318558977", "MUN_HEB": "הר אדר", "MUN_ENG": "Har Adar", "type": "residential" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 35.1291969, 31.8201457 ], [ 35.1295616, 31.8203553 ], [ 35.1297494, 31.8207715 ], [ 35.1296957, 31.8212091 ], [ 35.1290627, 31.8222119 ], [ 35.1296367, 31.8219233 ], [ 35.1300176, 31.8218654 ], [ 35.1304897, 31.821911 ], [ 35.1307253, 31.821961 ], [ 35.1310608, 31.8220704 ], [ 35.1310528, 31.8220521 ], [ 35.1309629, 31.8218618 ], [ 35.1313908, 31.8215841 ], [ 35.1317664, 31.8216011 ], [ 35.1326247, 31.8215464 ], [ 35.1329356, 31.8215567 ], [ 35.1330535, 31.8214341 ], [ 35.1333361, 31.8215067 ], [ 35.1332588, 31.8216828 ], [ 35.1340409, 31.8216102 ], [ 35.1343306, 31.8216284 ], [ 35.1345023, 31.8217378 ], [ 35.1342233, 31.822148 ], [ 35.1341053, 31.8224124 ], [ 35.134116, 31.8232237 ], [ 35.1341911, 31.8234152 ], [ 35.1346256, 31.8236189 ], [ 35.1346417, 31.8238801 ], [ 35.1342931, 31.8245943 ], [ 35.134277, 31.8250561 ], [ 35.1344272, 31.8250834 ], [ 35.1344808, 31.8254116 ], [ 35.1350441, 31.8255059 ], [ 35.135382, 31.8256668 ], [ 35.1357897, 31.8260861 ], [ 35.1359614, 31.8272616 ], [ 35.1352694, 31.827484 ], [ 35.1348778, 31.8265962 ], [ 35.1346417, 31.8264321 ], [ 35.1342394, 31.8264084 ], [ 35.1337298, 31.8263865 ], [ 35.1334562, 31.8262443 ], [ 35.1333382, 31.8261258 ], [ 35.1333293, 31.8259438 ], [ 35.1328903, 31.8260231 ], [ 35.1329169, 31.825697 ], [ 35.1328898, 31.825383 ], [ 35.133154, 31.8253277 ], [ 35.133108, 31.8248765 ], [ 35.133052, 31.8248785 ], [ 35.1329586, 31.8250511 ], [ 35.1327321, 31.825557 ], [ 35.1325364, 31.8259224 ], [ 35.1325262, 31.8259391 ], [ 35.132137, 31.8262248 ], [ 35.1317428, 31.8263142 ], [ 35.1314714, 31.8264722 ], [ 35.1323994, 31.8268605 ], [ 35.1330753, 31.8273801 ], [ 35.1334133, 31.828113 ], [ 35.1337304, 31.8282454 ], [ 35.1338488, 31.8287516 ], [ 35.1339905, 31.8291783 ], [ 35.1340152, 31.8296626 ], [ 35.1336356, 31.8306125 ], [ 35.1336725, 31.8307434 ], [ 35.1338451, 31.8307958 ], [ 35.1339574, 31.8309304 ], [ 35.1333114, 31.8312177 ], [ 35.1333394, 31.8315556 ], [ 35.1328608, 31.83171 ], [ 35.1318254, 31.8318594 ], [ 35.1314553, 31.8318558 ], [ 35.1310637, 31.8316771 ], [ 35.1307472, 31.8314 ], [ 35.130597, 31.8310172 ], [ 35.1304682, 31.8306708 ], [ 35.1303985, 31.8306289 ], [ 35.129803, 31.8308075 ], [ 35.1292612, 31.8309753 ], [ 35.129331, 31.8312086 ], [ 35.1292129, 31.8313909 ], [ 35.1278289, 31.8322478 ], [ 35.1272335, 31.8324064 ], [ 35.1261767, 31.8323662 ], [ 35.125533, 31.8321931 ], [ 35.1248892, 31.8318467 ], [ 35.1245566, 31.831473 ], [ 35.1243957, 31.8310628 ], [ 35.124385, 31.8307073 ], [ 35.1244493, 31.8303974 ], [ 35.1244386, 31.8300692 ], [ 35.1245888, 31.8294767 ], [ 35.1255651, 31.8284649 ], [ 35.1256724, 31.8282279 ], [ 35.124326, 31.8281586 ], [ 35.1242133, 31.8279909 ], [ 35.1241167, 31.8277083 ], [ 35.124283, 31.8274385 ], [ 35.1245244, 31.8273892 ], [ 35.1245244, 31.8269881 ], [ 35.1245352, 31.8267329 ], [ 35.12468, 31.8266363 ], [ 35.1247283, 31.8263045 ], [ 35.1250877, 31.825907 ], [ 35.1257422, 31.8255515 ], [ 35.1256671, 31.8252507 ], [ 35.1253881, 31.824886 ], [ 35.1250341, 31.8243938 ], [ 35.1248517, 31.8239744 ], [ 35.1248141, 31.8237342 ], [ 35.1249429, 31.8235793 ], [ 35.1256671, 31.8229535 ], [ 35.1273515, 31.821586 ], [ 35.1281776, 31.8209205 ], [ 35.1286175, 31.82041 ], [ 35.1289233, 31.8201516 ], [ 35.1291969, 31.8201457 ] ] ] } }
													
													] }
												}
												//geom={tree.geom}
                                                hideZoom={true}
                                                disableInteractions={true}
												//title={tree.place}
												title="נהריה"
                                            />
                                        </CardMedia>
                                        <CardContent className="card-content">
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2"
                                                color="textPrimary"
                                            >
                                                {`כריתה/העתקה של ${tree.number_of_trees} עצים - ${tree.street} ${tree.street_number}` }
                                            </Typography>
                                            {/* <Typography component="p" color="textPrimary">
                                                <UnsafeRender
                                                    html={
                                                        plan.main_details_from_mavat
                                                    }
                                                />
                                            </Typography> */}
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
