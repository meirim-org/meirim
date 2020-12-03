import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import InfiniteScroll from "react-infinite-scroll-component";

import api from "../services/api";
import locationAutocompleteApi from "../services/location-autocomplete";

import Wrapper from "../components/Wrapper";
import Mapa from "../components/Mapa";
import UnsafeRender from "../components/UnsafeRender";
import Autocomplete from "../components/AutoCompleteInput";

import t from "../locale/he_IL";
import "./Plans.css";

class Plans extends Component {
    state = {
        error: false,
        hasMore: true,
        noData: false,
        pageNumber: 1,
        planCounties: [],
        filterCounties: [],
        plans: [],
        address:'',
        addressLocation:[],
        list:[]
    };

    constructor(props) {
        super(props);

        this.loadPlans = this.loadPlans.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
    }

    handleAddressSubmit(address) {
        this.setState({
            plans: [],
            pageNumber:1,
            searchPoint:{}
        });

        // finding the address from the list 
        let placeId = this.findPlaceIdFromSuggestion(address);
        locationAutocompleteApi.getPlaceData(placeId)
        .then(data=>{
            this.setState({searchPoint:data.result.geometry.location})
            this.loadPlans(1, [],data.result.geometry.location);
        }).catch(error => this.setState({ error }));
    }

    findPlaceIdFromSuggestion(string){
        let {list} = this.state;
        return _.find(list,i=> i.label===string).id
    }

    handleInputChange(text) {

        this.setState({
            loadingAutocomplete:true
        })

        locationAutocompleteApi.autocomplete(text)
        .then((res)=>{
            this.setState({
                loadingAutocomplete:false,
                list:res
            })
        })
        .catch(error => {
            this.setState({ error })
            window.alert(error)
        });
    }

    loadPlans(pageNumber, filterCounties, point) {
        this.setState({
            noData: false
        });

        api.get(
            `/plan/?page=${pageNumber}`+
            (filterCounties.length >1 ?`&PLAN_COUNTY_NAME=${filterCounties.join(",")}`:"")+
            (point?`&distancePoint=${point.lat},${point.lng}`:"")
            
        )
            .then(result => {
                this.setState({
                    hasMore:
                        result.pagination.page < result.pagination.pageCount,
                    noData: this.state.plans.length + result.data.length === 0,
                    pageNumber,
                    filterCounties,
                    plans: [...this.state.plans, ...result.data]
                });
            })
            .catch(error => this.setState({ error }));
    }


    loadNextPage() {
        const { pageNumber, filterCounties, searchPoint } = this.state;
        this.loadPlans(pageNumber + 1, filterCounties, searchPoint);
    }

    componentDidMount() {
        const { pageNumber, filterCounties } = this.state;

        api.get("/plan_county")
            .then(result => {
                this.setState({
                    planCounties: result.data.map(county => {
                        return { label: county.PLAN_COUNTY_NAME };
                    })
                });
            })
            .catch(error => this.setState({ error }));

        this.loadPlans(pageNumber, filterCounties);
    }

    render() {
        const { plans, planCounties, error, noData, hasMore, list } = this.state;
        const { me } = this.props;

        return (
            <Wrapper me={me}>
                <div className="container">
                    <Autocomplete  classes=""
                        placeholder="חדש! צפו בתוכניות בקרבת כתובת לבחירתכם "
                        inputSuggestions={list}
                        onFilterChange={this.handleAddressSubmit.bind(this)}
                       onInputChange={this.handleInputChange.bind(this)}
                        ></Autocomplete>
                    <br />
                    <GridList
                        cellHeight={500}
                        cellWidth={335}
                        className="gridList"
                        cols={1}
                    >
                        {plans.map(plan => (
                            <Card className="card" raised={true} key={plan.id}>
                                <Link
                                    className="card-link"
                                    to={`/plan/${plan.id}`}
                                >
                                    <CardActionArea className="card-action-area">
                                        <CardMedia
                                            className="card-media"
                                            title={plan.PL_NUMBER}
                                        >
                                            <Mapa
                                                geom={plan.geom}
                                                hideZoom={true}
                                                disableInteractions={true}
                                                title={plan.PLAN_COUNTY_NAME}
                                                title2={plan.distance?` ${Math.ceil(plan.distance/5)*5} מ׳ מהכתובת`:'' }
                                            />
                                        </CardMedia>
                                        <CardContent className="card-content">
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2"
                                                color="textPrimary"
                                            >
                                                {plan.PL_NAME}
                                            </Typography>
                                            <Typography component="p" color="textPrimary">
                                                <UnsafeRender
                                                    html={
                                                        plan.main_details_from_mavat
                                                    }
                                                />
                                            </Typography>
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
                    dataLength={plans.length}
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

export default Plans;
