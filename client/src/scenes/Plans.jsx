import { Grid, Box } from '@material-ui/core';
import _ from 'lodash';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PlanCard, Typography } from 'shared';
import Autocomplete from '../components/AutoCompleteInput';
import AutocompleteBlock from '../components/AutoCompleteBlockInput';
import AutocompleteParcel from '../components/AutoCompleteParcelInput';
import Wrapper from '../components/Wrapper';
import { Translation } from '../locale/he_IL';
// import  t from '../locale/he_IL';
import api from '../services/api';
import locationAutocompleteApi from '../services/location-autocomplete';
import styled from 'styled-components';
import './Plans.css';

import SearchIcon from '@material-ui/icons/Search';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import Variants from './skeleton';

const InnerWrapper = styled.div`
    background: white;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    padding: 12px 6%;
    // margin: 1rem 0;
    width: 100%;

    @media (max-width: 380px) {
        margin: 3.8rem 0;
    }
`;

const AutocompleteWrapper = styled.div`
    width: 300px;
    border-radius: 8px;
    background: #f5f5f5;

    input[type='text'] {
        text-align: right;
        color: #918899;
        font-size: 18px;
        line-height: 24px;
        border-bottom: none;

        &::placeholder {
            opacity: 1;
        }
    }

    input:focus {
        border: 2px solid #652dd0;
        background: #faf6fe;
        border-radius: 8px;
        padding: 21px 6px;
    }

    input:focus::placeholder {
        color: transparent;
    }

    .MuiPaper-elevation1 {
        display: none;
    }

    .MuiInputBase-input {
        padding: 23px 8px;
        height: 0.1em !important;
    }

    #plans-search-input {
        padding: 0;
    }

    #plans-search-input-error {
        input[type='text'] {
            border: 2px solid #e21243;
            background: #fef4f6;
            border-radius: 8px;
            padding: 21px 6px;
            color: #1f1c21 !important;
        }
    }

    .MuiInput-underline:before {
        border-bottom: 0px;
    }
`;

const AutocompleteWrapperItems = styled.div`
    width: 136px;
    border-radius: 8px;
    background: #f5f5f5;

    @media (max-width: 763px) {
        width: 128px;
    }

    input[type='number'] {
        text-align: right;
        color: #918899;
        font-size: 18px;
        line-height: 24px;
        border-bottom: none;

        &::placeholder {
            opacity: 1;
        }
    }

    input:focus {
        border: 2px solid #652dd0;
        background: #faf6fe;
        border-radius: 8px;
        padding: 21px 6px;
    }

    input:focus::placeholder {
        color: transparent;
    }

    .MuiPaper-elevation1 {
        display: none;
    }

    .MuiInputBase-input {
        padding: 23px 8px;
        height: 0.1em !important;
    }

    #block-search-input {
        input[type='number'] {
            padding-right: 40px;
        }
    }

    #parcels-search-input {
        input[type='number'] {
            padding-right: 52px;
        }
    }

    #parcels-search-input-error,
    #block-search-input-error {
        input[type='number'] {
            border: 2px solid #e21243;
            background: #fef4f6;
            border-radius: 8px;
            padding: 21px 6px;
            color: #1f1c21 !important;
            padding-right: 50px;
        }
    }

    .MuiInput-underline:before {
        border-bottom: 0px;
    }
`;

const SelectWrapper = styled.div`
    border: 1px solid #652dd0;
    border-radius: 8px;
    padding: 8px 16px;

    .makeStyles-formControl-10 {
        margin-bottom: 1rem;
        @media (763px) {
            margin-bottom: 8px;
        }
    }

    .MuiOutlinedInput-notchedOutline {
        display: none;
    }

    .MuiSelect-select:focus {
        background: none !important;
    }

    .MuiSelect-outlined.MuiSelect-outlined {
        text-align: left !important;
        transition: none !important;
        padding: 0px !important;
    }

    .css-i4bv87-MuiSvgIcon-root {
        color: #652dd0;
        cursor: pointer;
    }
`;

const SelectItemsWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
    position: relative;

    @media (763px) {
        justify-content: space-between;
    }

    b {
        position: absolute;
        top: 11px;
        margin-right: 8px;
        z-index: 2;
    }
`;

const Button = styled.button`
    background: #652dd0;
    border: 1px solid #652dd0;
    border-radius: 8px;
    text-align: center;
    color: '#FFFFFF';
    cursor: pointer;
    padding: 2px 8px;
    margin-right: -12px;

    @media (763px) {
        margin-right: 0;
        margin-top: 0;
    }

    svg {
        font-size: 20px;
        color: #ffffff;
        margin-top: 5px;
    }
`;

// const classes = useStyles();
class Plans extends Component {
    state = {
        error: false,
        hasMore: true,
        noData: false,
        // loadingPlans: false,
        pageNumber: 1,
        plans: [],
        address: '',
        addressLocation: [],
        list: [],
        searchPoint: false,
        loadingAutocomplete: false,
        selected: 'textbox',
        state: false,
        block: '',
        parcel: '',
        blockinputerror: false,
        parcelinputerror: false,
        blockList: [],
        parcelList: [],
        loadingAutocompleteBlock: false,
        loadingAutocompleteParcel: false,
        isDisable: true,
        t: Translation(),
    };

    constructor(props) {
        super(props);

        this.loadPlans = this.loadPlans.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
    }

    handleSelectBox(event) {
        this.setState({
            selected: event.target.value,
            state: true,
        });
        if (event.target.value === 'inputbox') {
            this.setState({
                state: true,
            });
        } else {
            this.setState({
                state: false,
            });
        }
    }

    onEnteringBlockParcels() {
        if (this.state.block && this.state.parcel) {
            this.setState({
                // loadingPlans: true,
                plans: [],
            });
            this.loadPlansBlock(this.state.block, this.state.parcel);
            this.props.history.push(
                `/plans?block=${this.state.block},parcel=${this.state.parcel}`
            );
        } else if (this.state.block) {
            this.setState({
                // loadingPlans: true,
                plans: [],
            });
            this.loadPlansBlock(this.state.block);
            this.props.history.push(`/plans?block=${this.state.block}`);
        } else {
            this.setState({
                blockinputerror: true,
                parcelinputerror: true,
            });
        }
    }

    handleAddressSubmit(address) {
        // reset current displayed plans
        this.setState({
            // loadingPlans: true,
            hasMore: true,
            noData: false,
            plans: [],
            pageNumber: 1,
            searchPoint: false,
            searchType: 'כתובת', //גוש חלקה
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
            // loadingPlans: true,
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
                    // loadingPlans: false,
                    pageNumber,
                    plans: [...this.state.plans, ...result.data],
                });
            })

            .catch((error) =>
                this.setState({
                    error: '',
                    // loadingPlans: false
                })
            );
        // .catch((error) => this.setState({ error: 'שגיאה בשליפת תוכניות' }));
    }

    loadNextPage() {
        // if (!this.state.loadingPlans) {
        this.loadPlans(this.state.pageNumber + 1, this.state.searchPoint);
        // }
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

    // Making a function to make a API Call to the backend and fetch the Data of block and parcels
    async loadPlansBlock(blockNum, parcelNum = 0) {
        this.setState({
            noData: false,
            loadingPlans: true,
        });

        await api
            .get(
                `/centroid?blockNum=${blockNum}${
                    parcelNum ? `&parcelNum=${parcelNum}` : ''
                }`
            )
            .then((result) => {
                // Run the Above Query When Data is Comming From Other API
                const obj = JSON.parse(result.data[0].centroid);
                const searchLocation = {
                    lat: obj.coordinates[0],
                    lng: obj.coordinates[1],
                };
                this.setState({
                    searchPoint: searchLocation,
                });
                // this.loadPlans(this.state.pageNumber);

                this.loadPlans(this.state.pageNumber, searchLocation);
            })
            .catch((error) => this.setState({ error: '' }));
    }

    async handleInputChangeBlock(blockNum) {
        if (blockNum) {
            this.setState({
                loadingAutocompleteBlock: true,
                blockinputerror: false,
                blockList: [],
                parcel: 0,
            });

            await api
                .get(`/topfive?blockNum=${blockNum}`)
                .then((result) => {
                    this.setState({
                        blockList: result.data,
                        loadingAutocompleteBlock: false,
                    });
                })
                .catch((error) =>
                    this.setState({
                        loadingAutocompleteBlock: false,
                        blockinputerror: true,
                    })
                );
        } else {
            this.setState({
                blockList: [],
                loadingAutocompleteBlock: false,
            });
        }
    }

    async handleInputChangeParcel(parcelNum) {
        if (parcelNum) {
            this.setState({
                loadingAutocompleteParcel: true,
                parcelinputerror: false,
                parcelList: [],
            });

            await api
                .get(
                    `/topfive?blockNum=${this.state.block}&parcelNum=${parcelNum}`
                )
                .then((result) => {
                    this.setState({
                        parcelList: result.data,
                        loadingAutocompleteParcel: false,
                    });
                })
                .catch((error) => {
                    this.setState({
                        loadingAutocompleteParcel: false,
                        parcelinputerror: true,
                    });
                });
        } else {
            this.setState({
                blockList: [],
                loadingAutocompleteParcel: false,
            });
        }
    }

    handleSubmitBlockDetails(blockNum) {
        this.setState({
            loadingAutocomplete: false,
            loadingAutocompleteBlock: false,
            hasMore: true,
            noData: false,
            pageNumber: 1,
            searchPoint: false,
            searchType: 'כתובת', //גוש חלקה
            block: blockNum,
            isDisable: false,
            blockList: [],
        });
    }

    handleSubmitParcelDetails(parcelNum) {
        this.setState({
            loadingAutocomplete: false,
            loadingAutocompleteParcel: false,
            hasMore: true,
            noData: false,
            pageNumber: 1,
            searchPoint: false,
            searchType: 'כתובת', //גוש חלקה
            parcel: parcelNum,
            parcelList: [],
        });
    }

    componentDidMount() {
        // For
        window.addEventListener('storage', () => {
            let l = Translation();
            this.setState({
                t: l,
            });
        });
        // init location service
        locationAutocompleteApi.init();

        // is the query string contain the block and parcel number the fetch them and store in a state
        if (this.props.location.search.includes('block')) {
            const arr = this.props.location.search.split(',');

            var match_block = '';
            var match_parcel = '';

            // Checking the condition that the parcel is provided or not
            if (arr.length > 1) {
                match_block = arr[0].match(/(\d+)/);
                match_parcel = arr[1].match(/(\d+)/);
            } else {
                match_block = arr[0].match(/(\d+)/);
            }

            // Saving the value to the state
            if (match_block && match_parcel) {
                this.setState({
                    state: true,
                    selected: 'inputbox',
                    block: match_block[0],
                    parcel: match_parcel[0],
                });
                this.loadPlansBlock(match_block[0], match_parcel[0]);
            } else if (match_block) {
                this.setState({
                    state: true,
                    selected: 'inputbox',
                    block: match_block[0],
                });
                this.loadPlansBlock(match_block[0]);
            }
        }
        // if there is no valid query string params to search by run default search
        else if (!this.loadQsSearchParams()) {
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
        const {
            plans,
            error,
            noData,
            hasMore,
            list,
            loadingAutocomplete,
            selected,
            state,
            block,
            parcel,
            blockinputerror,
            parcelinputerror,
            blockList,
            parcelList,
            loadingAutocompleteBlock,
            loadingAutocompleteParcel,
            loadingPlans,
            isDisable,
            t,
        } = this.state;

        return (
            <Wrapper>
                <InnerWrapper>
                    <Box>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <Typography style={{ margin: '0px' }}>
                                {t.searchBy}
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        {/* <DropDown Box /> */}
                        <SelectWrapper>
                            <FormControl variant="outlined">
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={selected}
                                    style={{
                                        color: '#652dd0',
                                        fontWeight: 600,
                                    }}
                                    onChange={this.handleSelectBox.bind(this)}
                                    MenuProps={{
                                        style: { margin: '3rem 1rem' },
                                    }}
                                    label=""
                                    IconComponent={() => <ExpandMoreIcon />}
                                >
                                    <MenuItem value={'textbox'}>
                                        {t.textbox}
                                    </MenuItem>
                                    <MenuItem value={'inputbox'}>
                                        {t.inputbox}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </SelectWrapper>
                    </Box>

                    {/* Making a state to show the drop content on change the select  */}
                    {!state ? (
                        <Box
                            item
                            xs={5}
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-end"
                        >
                            <AutocompleteWrapper>
                                <Autocomplete
                                    classes=""
                                    id={
                                        error
                                            ? 'plans-search-input-error'
                                            : 'plans-search-input'
                                    }
                                    placeholder={t.searchAddress}
                                    inputSuggestions={list}
                                    onFilterChange={this.handleAddressSubmit.bind(
                                        this
                                    )}
                                    onInputChange={this.handleInputChange.bind(
                                        this
                                    )}
                                    loading={loadingAutocomplete}
                                />
                            </AutocompleteWrapper>
                        </Box>
                    ) : (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <SelectItemsWrapper>
                                <AutocompleteWrapperItems>
                                    <b>{t.block}</b>
                                    <AutocompleteBlock
                                        classes=""
                                        id={
                                            blockinputerror
                                                ? 'block-search-input-error'
                                                : 'block-search-input'
                                        }
                                        placeholder={'5463'}
                                        value={block}
                                        inputSuggestions={blockList}
                                        onFilterChange={this.handleSubmitBlockDetails.bind(
                                            this
                                        )}
                                        onInputChange={this.handleInputChangeBlock.bind(
                                            this
                                        )}
                                        loading={loadingAutocompleteBlock}
                                    />
                                </AutocompleteWrapperItems>
                                <AutocompleteWrapperItems>
                                    <b>{t.parcel}</b>
                                    <AutocompleteParcel
                                        classes=""
                                        id={
                                            parcelinputerror
                                                ? 'parcels-search-input-error'
                                                : 'parcels-search-input'
                                        }
                                        placeholder={'554'}
                                        value={parcel}
                                        inputSuggestions={parcelList}
                                        onFilterChange={this.handleSubmitParcelDetails.bind(
                                            this
                                        )}
                                        onInputChange={this.handleInputChangeParcel.bind(
                                            this
                                        )}
                                        loading={loadingAutocompleteParcel}
                                        disable={isDisable}
                                    />
                                </AutocompleteWrapperItems>
                            </SelectItemsWrapper>
                            <Button
                                type="button"
                                color={'#652dd0'}
                                onClick={this.onEnteringBlockParcels.bind(this)}
                            >
                                <SearchIcon style={{ fontSize: 24 }} />
                            </Button>
                        </div>
                    )}
                </InnerWrapper>
                <br />

                <div className="container">
                    {/* Grid to show the Plans in card format  */}
                    <Grid container spacing={5}>
                        {plans.map((plan) => (
                            <PlanCard plan={plan} key={plan.id} />
                        ))}
                    </Grid>

                    {/* Showing the skeleton at loading time 
                    // {loadingPlans && <Variants />} */}

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
