import { Grid } from '@material-ui/core';
import _ from 'lodash';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PlanCard, Typography } from 'shared';
import Wrapper from '../components/Wrapper';
import t from '../locale/he_IL';
import api from '../services/api';
import locationAutocompleteApi from '../services/location-autocomplete';
import './Plans.css';
import styled from 'styled-components';
import SearchBox from '../pages/Homepage/SearchBox';
import { device } from '../style';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/animations/loader.json';

const PlansHeader = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 1.5rem 28px;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 2px 13px rgba(0, 0, 0, 0.08);
    flex-direction: column;
    opacity: ${(props) => props.opacity};
    transform: ${(props) => `translateY(${props.translateY}px)`};
    transition: 0.2s ease-in-out;
    z-index: 2;
    @media ${device.laptop} {
        padding: 16px 4.8rem 28px;
    }
`;

const PlansHeaderTitle = styled.div`
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    display: flex;
    justify-content: flex-start;
    @media ${device.tablet} {
        font-size: 36px;
        line-height: 42px;
    }
`;

const PlansHeaderText = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    justify-content: flex-start;
    @media ${device.tablet} {
        font-size: 20px;
        line-height: 26px;
    }
`;

const PlansHeaderContent = styled.div`
    font-family: 'Assistant', sans-serif;
    font-style: normal;
    color: #1f1c21;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 32px;
    transition: 0.2s ease-in-out;
    opacity: ${(props) => props.opacity};
`;

const PlansHeaderSearchBox = styled.div`
    width: 100%;

    > div {
        height: auto;
        margin: 0;
        @media screen and (max-width: 767px) {
            padding: 0;
        }

        .MuiInputBase-input {
            padding: 23px 8px 23px;
        }

        button {
            background-color: #652dd0;
            @media screen and (max-width: 767px) {
                height: 50px;
                margin-top: -49px;
            }
        }

        #block-search-input,
        #parcels-search-input {
            .MuiInput-underline {
                &:before,
                &:after {
                    content: none !important;
                }
            }
        }

        input {
            background: #fbfbfb;
            border: 1px solid #b8b8b8 !important;
            height: 48px !important;
            border-radius: 8px;
        }

        .makeStyles-selectWrapper-13,
        .makeStyles-selectWrapper-11 {
            border-radius: 8px;
            background: #ffffff;
            border: 1px solid #652dd0;
            padding: 0 20px 0 15px;

            .makeStyles-formControl-12,
            .makeStyles-formControl-10 {
                margin-right: 0;
                margin-bottom: 0;
            }

            .makeStyles-selectControl-14,
            .makeStyles-selectControl-12 {
                color: #652dd0;
                font-style: normal;
                font-weight: 600;
                font-size: 18px;
                font-family: 'Assistant', sans-serif;
            }
        }

        .makeStyles-selectWrapper-11 {
            padding: 5px 12px 5px 8px;
            border-radius: 4px;
            margin-bottom: 16px;
            max-width: 147px;
            box-sizing: border-box;
        }

        .makeStyles-selectControl-12 {
            font-size: 16px !important;
        }
    }
`;

const PlansWrapper = styled.div`
    width: 100%;
    margin-top: 310px;
    @media ${device.tablet} {
        margin-top: 280px;
    }
    @media screen and (max-width: 670px) {
        margin-top: 350px;
    }
`;

const PlansSearchingContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-family: 'Assistant', sans-serif;
    font-size: 18px;
    line-height: 24px;
`;

const PlansSearchingText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    span {
        color: #652dd0;
        font-weight: 600;
    }
`;

const PlansSearching = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;

    svg {
        width: 160px !important;
        height: 160px !important;
        @media ${device.tablet} {
            width: 280px !important;
            height: 280px !important;
        }
    }
`;

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
        loadingAutocomplete: false,
        lastScrollY: 0,
        hiddenTopSection: false,
        hiddenTopContentSection: false,
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
            pageNumber: 1,
            searchPoint: false,
            translateY: 0,
        });

        // get selected place id
        const placeId = this.findPlaceIdFromSuggestion(address);

        // get place location
        locationAutocompleteApi
            .getPlaceLocation(placeId)
            .then((location) => {
                // this will trigger a component update which will identify the new
                // query string and initiate a location search
                this.props.history.push(
                    `${window.location.pathname}?loc=${location.lat},${location.lng}`
                );
            })
            .catch((error) =>
                this.setState({ error: 'שגיאה בחיפוש לפי כתובת' })
            );
    }

    findPlaceIdFromSuggestion(string) {
        let { list } = this.state;
        return _.find(list, (i) => i.label === string).id;
    }

    handleInputChange(text) {
        if (text) {
            this.setState({
                loadingAutocomplete: true,
            });

            this.getAutocompleteSuggestions(text);
        } else {
            // cancel previously-called debounced autocomplete
            this.getAutocompleteSuggestions.cancel();

            this.setState({
                list: [],
                loadingAutocomplete: false,
            });
        }
    }

    getAutocompleteSuggestions = _.debounce((input) => {
        locationAutocompleteApi
            .autocomplete(input)
            .then((res) => {
                this.setState({
                    loadingAutocomplete: false,
                    list: res,
                });
            })
            .catch((error) => {
                this.setState({
                    error: 'שגיאה בחיפוש לפי כתובת',
                    loadingAutocomplete: false,
                });
            });
    }, process.env.CONFIG.geocode.autocompleteDelay);

    loadPlans(pageNumber, point) {
        this.setState({
            noData: false,
            loadingPlans: true,
        });

        api.get(
            `/plan/?page=${pageNumber}` +
                (point ? `&distancePoint=${point.lng},${point.lat}` : '')
        )
            .then((result) => {
                this.setState({
                    hasMore:
                        result.pagination.page < result.pagination.pageCount,
                    noData: this.state.plans.length + result.data.length === 0,
                    loadingPlans: false,
                    pageNumber,
                    plans: [...this.state.plans, ...result.data],
                });
            })
            .catch((error) => this.setState({ error: 'שגיאה בשליפת תוכניות' }));
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
            const locParts = qs
                .get('loc')
                .split(',')
                .map((i) => parseFloat(i));
            if (
                locParts.length === 2 &&
                !isNaN(locParts[0]) &&
                !isNaN(locParts[1])
            ) {
                searchLocation = { lat: locParts[0], lng: locParts[1] };
            }
        }

        if (searchLocation !== undefined) {
            // reset plans in case this was a navigation
            this.setState({
                plans: [],
                pageNumber: 1,
                searchPoint: searchLocation,
            });

            // load plans by params
            this.loadPlans(1, searchLocation);

            return true;
        } else {
            return false;
        }
    }

    handleScrollEvent = (e) => {
        if (this.lastScrollY > window.scrollY) {
            this.setState({
                hiddenTopSection: false,
                translateY: -100,
            });
        } else if (this.lastScrollY < window.scrollY) {
            this.setState({
                hiddenTopSection: true,
                hiddenTopContentSection: true,
                translateY: -200,
            });
            console.log('down');
        }
        this.lastScrollY = window.scrollY;
        if (window.scrollY === 0) {
            this.setState({
                hiddenTopSection: false,
                hiddenTopContentSection: false,
                translateY: -0,
            });
        }
    };

    componentDidMount() {
        this.lastScrollY = window.scrollY;
        // init location service
        locationAutocompleteApi.init();

        // if there is no valid query string params to search by run default search
        if (!this.loadQsSearchParams()) {
            this.loadPlans(this.state.pageNumber);
        }

        document.addEventListener('scroll', this.handleScrollEvent);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handleScrollEvent);
    }

    componentDidUpdate(prevProps) {
        // if the query string has changed load it into a search
        if (this.props.location.search !== prevProps.location.search) {
            this.loadQsSearchParams();
        }
    }

    render() {
        const {
            plans,
            error,
            noData,
            hasMore,
            list,
            loadingAutocomplete,
            hiddenTopSection,
            hiddenTopContentSection,
            translateY,
            loadingPlans,
        } = this.state;

        return (
            <Wrapper>
                <PlansHeader
                    translateY={translateY}
                    opacity={!hiddenTopSection ? 1 : 0}
                >
                    <PlansHeaderContent
                        opacity={!hiddenTopContentSection ? 1 : 0}
                    >
                        <PlansHeaderTitle>
                            {t.plansHelperTitle}
                        </PlansHeaderTitle>
                        <PlansHeaderText>{t.plansHelperText}</PlansHeaderText>
                    </PlansHeaderContent>
                    <PlansHeaderSearchBox>
                        <SearchBox
                            backgroundColor="none"
                            wrapperPadding="0px"
                        />
                    </PlansHeaderSearchBox>
                </PlansHeader>
                <PlansWrapper>
                    {loadingPlans ? (
                        <PlansSearching>
                            <Lottie
                                animationData={loadingAnimation}
                                loop={true}
                            />
                            <PlansSearchingContent>
                                <PlansSearchingText>
                                    {t.plansSearchingTextA}
                                </PlansSearchingText>
                                <PlansSearchingText>
                                    <span>{t.plansSearchingTextB}</span>
                                </PlansSearchingText>
                            </PlansSearchingContent>
                        </PlansSearching>
                    ) : (
                        <div className="container">
                            <Grid container spacing={5}>
                                {plans.map((plan) => (
                                    <PlanCard plan={plan} key={plan.id} />
                                ))}
                            </Grid>
                            {error && (
                                <div className="error-container">{error}</div>
                            )}
                            {noData && <div>אין כאן כלום</div>}
                        </div>
                    )}
                </PlansWrapper>
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
