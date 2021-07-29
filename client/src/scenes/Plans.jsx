import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlanCard, Typography } from 'shared';
import Autocomplete from "../components/AutoCompleteInput";
import Wrapper from "../components/Wrapper";
import t from "../locale/he_IL";
import api from "../services/api";
import locationAutocompleteApi from "../services/location-autocomplete";
import "./Plans.css";

class Plans extends Component {
    state = {
        error: false,
        hasMore: true,
        noData: false,
        loadingPlans: false,
        pageNumber: 1,
        plans: [],
        address: '',
        addressLocation: [],
        list: [],
        searchPoint: false,
        loadingAutocomplete: false
    };

    constructor(props) {
        super(props);

        this.loadPlans = this.loadPlans.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
    }

    handleAddressSubmit(address) {
        // reset current displayed plans
        this.setState({
            loadingPlans: true,
            hasMore: true,
            noData: false,
            plans: [],
            pageNumber:1,
            searchPoint: false
        });

        // get selected place id
        const placeId = this.findPlaceIdFromSuggestion(address);

        // get place location
        locationAutocompleteApi.getPlaceLocation(placeId)
            .then(location => {
                // this will trigger a component update which will identify the new
                // query string and initiate a location search
                this.props.history.push(`${window.location.pathname}?loc=${location.lat},${location.lng}`);
            }).catch(error => this.setState({ error: "שגיאה בחיפוש לפי כתובת" }));
    }

    findPlaceIdFromSuggestion(string){
        let {list} = this.state;
        return _.find(list,i=> i.label===string).id
    }

    handleInputChange(text) {
        if (text) {
            this.setState({
                loadingAutocomplete: true
            });

            this.getAutocompleteSuggestions(text);
        } else {
            // cancel previously-called debounced autocomplete
            this.getAutocompleteSuggestions.cancel();

            this.setState({
                list: [],
                loadingAutocomplete: false
            });
        }
    }

    getAutocompleteSuggestions = _.debounce((input) => {
        locationAutocompleteApi.autocomplete(input).then((res) => {
            this.setState({
                loadingAutocomplete: false,
                list: res
            });
        }).catch(error => {
            this.setState({ error: "שגיאה בחיפוש לפי כתובת", loadingAutocomplete: false });
        });
    }, process.env.CONFIG.geocode.autocompleteDelay);

    loadPlans(pageNumber, point) {
        this.setState({
            noData: false,
            loadingPlans: true
        });

        api.get(
            `/plan/?page=${pageNumber}`+
            (point ? `&distancePoint=${point.lng},${point.lat}` : "")
        )
            .then(result => {
                this.setState({
                    hasMore:
                        result.pagination.page < result.pagination.pageCount,
                    noData: this.state.plans.length + result.data.length === 0,
                    loadingPlans: false,
                    pageNumber,
                    plans: [...this.state.plans, ...result.data]
                });
            })
            .catch(error => this.setState({ error: "שגיאה בשליפת תוכניות" }));
    }

    loadNextPage() {
        if (!this.state.loadingPlans) {
            this.loadPlans(this.state.pageNumber + 1, this.state.searchPoint);
        }
    }

    loadQsSearchParams() {
        // read query string
        const qs = new URLSearchParams(this.props.location.search);

        let searchLocation;

        // load "loc" param and make sure it is the right format
        if (qs.get('loc')) {
            const locParts = qs.get('loc').split(',').map(i => parseFloat(i));
            if (locParts.length === 2 && !isNaN(locParts[0]) && !isNaN(locParts[1])) {
                searchLocation = {lat: locParts[0], lng: locParts[1]};
            }
        }

        if (searchLocation !== undefined) {
            // reset plans in case this was a navigation
            this.setState({
                plans: [],
                pageNumber:1,
                searchPoint: searchLocation
            });

            // load plans by params
            this.loadPlans(1, searchLocation);

            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        // init location service
        locationAutocompleteApi.init();

        // if there is no valid query string params to search by run default search
        if (!this.loadQsSearchParams()) {
            this.loadPlans(this.state.pageNumber);
        }
    }

    componentDidUpdate(prevProps) {
        // if the query string has changed load it into a search
        if (this.props.location.search !== prevProps.location.search) {
            this.loadQsSearchParams();
        }
    }

    render() {
        const { plans, error, noData, hasMore, list, loadingAutocomplete } = this.state;

        return (
            <Wrapper>
                <Typography
                    className="plans-helper-text"
                    component="span"
                    variant="largeParagraphText"
                    mobileVariant="paragraphText"
                    color="#000000"
                >
                    {t.plansHelperText}
                </Typography>
                <div className="container">
                    <Autocomplete classes=""
                        id="plans-search-input"
                        placeholder="לדוגמה: תרמ&quot;ב 6, ראשון לציון"
                        inputSuggestions={list}
                        onFilterChange={this.handleAddressSubmit.bind(this)}
                        onInputChange={this.handleInputChange.bind(this)}
                        loading={loadingAutocomplete}
                    />
                    <br />
                    <Grid container spacing={4}>
                        {plans.map(plan => (
                            <PlanCard plan={plan} key={plan.id}/>
                        ))}
                    </Grid>

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
