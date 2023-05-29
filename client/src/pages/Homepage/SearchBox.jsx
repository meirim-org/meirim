import { useTranslation } from 'locale/he_IL';
import _ from 'lodash';
// import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { device } from 'style';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '../../components/AutoCompleteInput';
import locationAutocompleteApi from '../../services/location-autocomplete';
import api from 'services/api';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AutocompleteBlock from '../../components/BlockParcelAutocomplete/BlockParcelAutocompleteInput';
import AutocompleteParcel from '../../components/BlockParcelAutocomplete/BlockParcelAutocompleteInput';
import classNames from 'classnames';
import { ExpandMoreRounded } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import {
    setAddressText,
    setSearchType,
    setBlockNum,
    setParcel,
} from '../../redux/search/slice';
import { SearchSelectors } from '../../redux/selectors';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: 0,
        marginRight: 12,
        minWidth: 80,
        display: 'block',
    },
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    selectControl: {
        height: 0,
        minHeight: '0.1876em',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Assistant',
    },
    select: {
        margin: '3rem 1rem',
    },
    pointer: {
        cursor: 'pointer',
    },
    expandMoreIcon: {
        width: 31,
        height: 31,
    },
}));

const BlockInputErrorBlock = styled.div`
    position: absolute;
    bottom: -47px;
    padding: 9px 5px;
    width: 185px;
    text-align: center;
    left: calc(50% - 93px);
    background: #ffffff;
    border: 1px solid #f5f5f5;
    box-shadow: -2px 4px 4px rgba(0, 0, 0, 0.06),
        1px 1px 1px rgba(0, 0, 0, 0.08);
    border-radius: 8px;

    @media screen and (max-width: 767px) {
        z-index: 1;
        right: 0;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: stretch;
    gap: 8px;
    background-color: ${({ background }) => background || '#652DD0'};
    ${({ background }) =>
        !background &&
        `box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198), 0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275), 0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035), 0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);`}
    padding: 20px;
    width: 100%;
    height: ${({ height }) => height || '136px'};
    margin: 1em auto;
    z-index: 1;
    margin-bottom: 5px;

    @media ${device.tablet} {
        width: 520px;
        height: 88px;
        padding: ${({ wrapperPadding }) => wrapperPadding || '32px'};
        margin: ${({ wrapperMargin }) => wrapperMargin || '32px 0px 0px 0px'};
        border-radius: 12px;
    }
`;

const Title = styled.p`
    color: ${({ color }) => color || '#ffffff'};
    text-align: right;
    font-size: 22px;
    line-height: 22px;
    margin-bottom: 22px;

    @media ${device.tablet} {
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 28px;
    }
`;

const Button = styled.button`
    margin-right: auto;
    background: transparent;
    border: 1px solid ${({ color }) => color || '#FFFFFF'};
    border-radius: 8px;
    text-align: center;
    color: ${({ color }) => color || '#FFFFFF'};
    line-height: 1;
    cursor: pointer;
    padding: 8px 11px;
    margin-top: -47px;
    @media ${device.tablet} {
        width: 48px;
        height: 48px;
        margin-right: 0;
        margin-top: 0;
    }
`;

const AutocompleteWrapper = styled.div`
    width: 220px;
    background-color: #ffffff;
    margin: 0;
    border-radius: 8px;
    position: relative;

    input[type='text'] {
        color: ${({ color }) => color || '#000000'};
        font-size: 18px;
        height: 48px !important;
        border-bottom: none;
        box-sizing: border-box;
        padding: 0 12px;
        border-bottom: none;

        &::placeholder {
            opacity: 1;
            color: #918899;
        }
    }

    input:focus::placeholder {
        color: transparent;
    }

    .MuiPaper-elevation1 {
        display: none;
    }

    .MuiInputBase-input {
        padding: 22px 8px 22px;
        height: 0.1876em !important;
    }

    @media ${device.tablet} {
        margin-bottom: 0;
        width: 288px;
        //overflow-x: hidden;
    }
`;

const AutocompleteWrapperItem = styled.div`
    background-color: #ffffff;
    margin: 0px 0px 0px 8px;
    border-radius: 8px;
    position: relative;
    width: 110px;

    input[type='number'] {
        color: ${({ color }) => color || '#000000'};
        font-size: 18px;
        line-height: 18px;
        border-bottom: none;

        &::placeholder {
            opacity: 1;
            color: #918899;
        }
    }

    input:focus::placeholder {
        color: transparent;
    }

    .MuiPaper-elevation1 {
        display: none;
    }

    .MuiInputBase-input {
        padding: 24px 8px 24px;
        height: 0.1876em !important;
    }

    #block-search-input {
        input[type='number'] {
            padding-right: 52px;
            box-sizing: border-box;
        }
    }

    #parcels-search-input {
        input[type='number'] {
            padding-right: 60px;
            box-sizing: border-box;
        }
    }

    #parcels-search-input-error {
        input[type='number'] {
            border: 2px solid #e21243;
            background: #fef4f6;
            border-radius: 8px;
            padding: 21px 6px;
            color: #1f1c21 !important;
            padding-right: 50px;
        }
    }

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

    b {
        position: absolute;
        margin-right: 12px;
        top: 12px;
        z-index: 2;
    }

    @media ${device.tablet} {
        margin-bottom: 0;
        width: 131px;
    }

    &:last-child {
        margin-left: 0;
    }
`;

const SelectWrapper = styled.div`
    .makeStyles-formControl-10 {
        //margin-bottom: 1rem;
        @media ${device.mobile} and (max-width: 767px) {
            margin-bottom: 18px;
            margin-right: 0;
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
        color: white;
        cursor: pointer;
    }

    .MuiPaper-root {
        margin: 3rem 1rem !important;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;

    @media ${device.tablet} {
        flex-direction: row;
        justify-content: space-between;
    }

    .MuiLinearProgress-root {
        height: 8px !important;
        overflow: hidden;
        position: relative;
        border-bottom-left-radius: 360px;
        border-bottom-right-radius: 360px;
        margin-top: -8px;
    }

    .MuiInput-underline:before,
    .MuiInput-underline:after {
        border-bottom: none !important;
    }

    .text {
        font-family: Assistant;
    }
`;

export default function SearchBox({
    backgroundColor,
    color,
    showTitle,
    wrapperMargin,
    wrapperPadding,
    height,
}) {
    const { search } = SearchSelectors();
    const [addresses, setAddresses] = useState([]);
    const [placeId, setPlaceId] = useState(search.addressPlaceId);
    const [loadingAutocomplete, setloadingAutocomplete] = useState(false);
    const { t } = useTranslation();
    const history = useHistory();

    // Making a logic to change the input types using dropdown
    const classes = useStyles();
    const dispatch = useDispatch();

    const [block, setBlock] = useState(search.block);
    const [parcels, setParcels] = useState(search.parcel);
    const [blockinputerror, setBlockinputerror] = useState(false);
    const [parcelinputerror, setParcelinputerror] = useState(false);
    const [isDisable, setIsDisable] = useState(true);

    // making the State to get the plans list
    const [blockList, setblockList] = useState([]);
    const [parcelList, setparcelList] = useState([]);
    const [loadingAutocompleteBlock, setloadingAutocompleteBlock] =
        useState(false);
    const [loadingAutocompleteParcel, setloadingAutocompleteParcel] =
        useState(false);

    const [selected, setSelected] = React.useState(search.type);

    const getAutocompleteSuggestions = useCallback(
        _.debounce(async (input) => {
            const res = await locationAutocompleteApi.autocomplete(input);
            setloadingAutocomplete(false);
            setAddresses(res);
        }, process.env.CONFIG.geocode.autocompleteDelay),
        []
    );

    async function onInputChange(input) {
        if (input) {
            setloadingAutocomplete(true);
            getAutocompleteSuggestions(input);
        } else {
            // cancel pending calls and clear results
            getAutocompleteSuggestions.cancel();
            setloadingAutocomplete(false);
            setAddresses([]);
            dispatch(
                setAddressText({
                    addressText: '',
                    addressPlaceId: '',
                })
            );
        }
    }

    function onFilterChange(data) {
        if (data) {
            const place = addresses.find((address) => address.label === data);
            if (place) {
                setPlaceId(place.id);
                dispatch(
                    setAddressText({
                        addressText: data,
                        addressPlaceId: place.id,
                    })
                );
            }
        }
    }

    async function onGoToPlansClick() {
        if (placeId) {
            const { lat, lng } = await locationAutocompleteApi.getPlaceLocation(
                placeId
            );
            history.push(`/plans?loc=${lat},${lng}`);
        }
    }

    // Making the function to make a backend call and fetch the Block and parcels Data
    async function onEnteringBlockParcels() {
        if (block && parcels) {
            // history.push(`/plans?block=${block}&parcel=${parcels}`);
            // getting the block and parcel lat lon
            const currentParcel = parcelList.find(
                (parcel) => parcel.label === parcels
            );
            const [lng, lat] = JSON.parse(currentParcel?.centroid)?.coordinates;
            if (lat && lng) history.push(`/plans?loc=${lat},${lng}`);
        } else if (!block && parcels) {
            setBlockinputerror(true);
        } else if (block && !parcels) {
            setParcelinputerror(true);
        } else {
            setParcelinputerror(true);
            setBlockinputerror(true);
        }
    }

    async function handleInputChangeBlock(text) {
        if (text) {
            // setBlock(text);
            setloadingAutocompleteBlock(true);
            setBlockinputerror(false);

            api.get(`/topfive?blockNum=${text}`)
                .then((result) => {
                    if (result.status === 'failed') {
                        throw new Error('No parcels found');
                    }
                    setblockList(result.data);
                    setloadingAutocompleteBlock(false);
                })
                .catch((error) => {
                    setBlockinputerror(true);
                    setloadingAutocompleteBlock(false);
                });
        } else {
            setblockList([]);
            setloadingAutocompleteBlock(false);
        }
    }

    function handleSubmitBlockDetails(blockNum) {
        setBlock(blockNum);
        dispatch(setBlockNum({ block: blockNum }));
        dispatch(setParcel({ parcel: '' }));
        setParcels(0);
        setIsDisable(false);
    }

    function handleSubmitParcelDetails(parcelNum) {
        setParcels(parcelNum);
        dispatch(setParcel({ parcel: parcelNum }));
    }

    async function handleInputChangeParcel(text) {
        if (text) {
            // setParcels(text);
            setParcelinputerror(false);
            setloadingAutocompleteParcel(true);

            api.get(`/topfive?blockNum=${block}&parcelNum=${text}`)
                .then((result) => {
                    if (result.status === 'failed') {
                        throw new Error('No parcels found');
                    }
                    setparcelList(result.data);
                    setloadingAutocompleteParcel(false);
                })
                .catch((error) => {
                    console.log({ error });
                    setloadingAutocompleteParcel(true);
                    setParcelinputerror(true);
                });
        } else {
            setloadingAutocompleteParcel(false);
            setparcelList([]);
        }
    }

    useEffect(() => {
        locationAutocompleteApi.init();
    }, []);

    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

    return (
        <Wrapper
            background={backgroundColor}
            height={height}
            wrapperMargin={wrapperMargin}
            wrapperPadding={wrapperPadding}
        >
            {showTitle && <Title color={color}>{t.searchBoxTitle}</Title>}
            <InputWrapper>
                <SelectWrapper className={classes.selectWrapper}>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={selected}
                            onChange={(event) => {
                                dispatch(
                                    setSearchType({ type: event.target.value })
                                );
                                setSelected(event.target.value);
                            }}
                            open={dropdownIsOpen}
                            onOpen={() => setDropdownIsOpen(true)}
                            onClose={() => setDropdownIsOpen(false)}
                            className={classes.selectControl}
                            MenuProps={{ classes: { paper: classes.select } }}
                            IconComponent={() => (
                                <ExpandMoreRounded
                                    className={classNames(
                                        classes.pointer,
                                        classes.expandMoreIcon,
                                        {
                                            'MuiSelect-iconOpen':
                                                dropdownIsOpen,
                                        }
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDropdownIsOpen(true);
                                    }}
                                />
                            )}
                        >
                            <MenuItem value={'searchAddress'}>
                                {t.searchAddress}
                            </MenuItem>
                            <MenuItem value={'searchBlockParcel'}>
                                {t.searchBlockParcel}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </SelectWrapper>

                {/* // making a State to Show the Input or Selected Icons //  */}
                {selected === 'searchBlockParcel' ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <AutocompleteWrapperItem color={color}>
                                <b>{t.block}</b>
                                <AutocompleteBlock
                                    placeholder={`16501`}
                                    t={t}
                                    value={block}
                                    id={
                                        blockinputerror
                                            ? 'block-search-input-error'
                                            : 'block-search-input'
                                    }
                                    blockInputError={blockinputerror}
                                    inputSuggestions={blockList}
                                    onInputChange={(input) => {
                                        handleInputChangeBlock(input);
                                    }}
                                    BlockInputErrorBlock={BlockInputErrorBlock}
                                    onFilterChange={(block) =>
                                        handleSubmitBlockDetails(block)
                                    }
                                    classes={classNames({ inputRoot: 'text' })}
                                    loading={loadingAutocompleteBlock}
                                />
                            </AutocompleteWrapperItem>
                            <AutocompleteWrapperItem color={color}>
                                <b>{t.parcel}</b>
                                <AutocompleteParcel
                                    placeholder={'26'}
                                    value={parcels}
                                    id={
                                        parcelinputerror
                                            ? 'parcels-search-input-error'
                                            : 'parcels-search-input'
                                    }
                                    blockInputError={parcelinputerror}
                                    inputSuggestions={parcelList}
                                    onInputChange={(input) => {
                                        handleInputChangeParcel(input);
                                    }}
                                    onFilterChange={(parcel) =>
                                        handleSubmitParcelDetails(parcel)
                                    }
                                    classes={classNames({ inputRoot: 'text' })}
                                    BlockInputErrorBlock={BlockInputErrorBlock}
                                    loading={loadingAutocompleteParcel}
                                    disable={isDisable}
                                />
                            </AutocompleteWrapperItem>
                        </div>
                        {/* // Button To Handle the Inputs and function of Block and Parcels //  */}
                        <Button
                            type="button"
                            onClick={onEnteringBlockParcels}
                            color={color}
                        >
                            <SearchIcon style={{ fontSize: 24 }} />
                        </Button>
                    </>
                ) : (
                    <>
                        <AutocompleteWrapper color={color}>
                            <Autocomplete
                                placeholder={t.searchAddressPlaceholder}
                                inputSuggestions={addresses}
                                onInputChange={onInputChange}
                                onFilterChange={onFilterChange}
                                classes={{ inputRoot: 'text' }}
                                loading={loadingAutocomplete}
                                value={search.addressText}
                            />
                        </AutocompleteWrapper>
                        {/* // Button To Handle the Inputs and function of Text Filed //  */}
                        <Button
                            type="button"
                            onClick={onGoToPlansClick}
                            color={color}
                        >
                            <SearchIcon style={{ fontSize: 24 }} />
                        </Button>
                    </>
                )}
            </InputWrapper>
        </Wrapper>
    );
}
