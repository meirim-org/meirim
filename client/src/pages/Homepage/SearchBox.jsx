import { useTranslation } from 'locale/he_IL';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { device } from 'style';
import styled from 'styled-components';
import Autocomplete from '../../components/AutoCompleteInput';
import AutocompleteBlock from '../../components/AutoCompleteBlockInput';
import AutocompleteParcel from '../../components/AutoCompleteParcelInput';
import locationAutocompleteApi from '../../services/location-autocomplete';
import SearchIcon from '@material-ui/icons/Search';

import api from 'services/api';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginRight: 0,
    minWidth: 80,
    display: 'block',
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
}));

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  gap: 8px;

  background-color: ${({ background }) => background || '#4D20B2'};
  ${({ background }) =>
    !background &&
    `box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198), 0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275), 0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035), 0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);`}
  padding: 18px;
  padding-top: 8px;
  width: 320px;
  height: ${({ height }) => height || '138px'};
  margin: 1em auto;
  z-index: 1;
  margin-bottom: 8px;
  border-radius: 12px;

  @media ${device.tablet} {
    width: 512px;
    height: 100px;
    padding: ${({ wrapperPadding }) => wrapperPadding || '20px'};
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
  padding: 5px 0;
  color: ${({ color }) => color || '#FFFFFF'};
  line-height: 1;
  cursor: pointer;
  padding: 8px 10px;
  margin-top: -47px;

  @media ${device.tablet} {
    margin-right: 0;
    margin-top: 0;
  }
`;

const AutocompleteWrapper = styled.div`
  margin-bottom: 35px;
  width: 220px;
  background-color: #ffffff;
  margin: 0px 8px;
  border-radius: 8px;
  position: relative;

  input[type='text'] {
    color: ${({ color }) => color || '#918899'};
    font-size: 18px;
    line-height: 18px;
    border-bottom: none;

    &::placeholder {
      opacity: 1;
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
    width: 100%;
  }
`;

const AutocompleteWrapperItem = styled.div`
  background-color: #ffffff;
  margin: 0px 0px 0px 8px;
  border-radius: 8px;
  position: relative;
  width: 110px;

  input[type='number'] {
    color: ${({ color }) => color || '#918899'};
    font-size: 18px;
    line-height: 18px;
    border-bottom: none;

    &::placeholder {
      opacity: 1;
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

  #block-search-input {
    input[type='number'] {
      padding-right: 40px;
    }
  }

  #parcels-search-input {
    input[type='number'] {
      padding-right: 54px;
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
    margin-right: 8px;
    top: 12px;
    z-index: 2;
  }

  @media ${device.tablet} {
    margin-bottom: 0;
    width: 100%;
  }
`;

const SelectWrapper = styled.div`
  .makeStyles-formControl-10 {
    margin-bottom: 1rem;
    @media ${device.tablet} {
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

  .text {
    font-family: Assistant;
    border-radius: 8px;
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
  const [addresses, setAddresses] = useState([]);
  const [placeId, setPlaceId] = useState('');
  const [loadingAutocomplete, setloadingAutocomplete] = useState(false);
  const { t } = useTranslation();

  const history = useHistory();
  // Making a logic to change the input types using dropdown
  const classes = useStyles();
  const [block, setBlock] = useState('');
  const [parcels, setParcels] = useState('');
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

  const [selected, setSelected] = React.useState('textbox');

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
    }
  }

  function onFilterChange(data) {
    if (data) {
      const place = addresses.find((address) => address.label === data);
      if (place) {
        setPlaceId(place.id);
      }
    }
  }

  async function onGoToPlansClick() {
    if (placeId) {
      const { lat, lng } = await locationAutocompleteApi.getPlaceLocation(
        placeId
      );
      window.location.href = `/plans?loc=${lat},${lng}`;
    }
  }

  // Making the function to make a backend call and fetch the Block and parcels Data
  async function onEnteringBlockParcels() {
    if (block && parcels) {
      history.push(`/plans?block=${block},parcel=${parcels}`);
    } else if (block) {
      history.push(`/plans?block=${block}`);
    } else {
      setBlockinputerror(true);
    }
  }

  async function handleInputChangeBlock(text) {
    if (text) {
      // setBlock(text);
      setloadingAutocompleteBlock(true);
      setBlockinputerror(false);

      await api
        .get(`/topfive?blockNum=${text}`)
        .then((result) => {
          setblockList(result.data);
          setloadingAutocompleteBlock(false);
        })
        .catch((error) => {
          setloadingAutocompleteBlock(true);
        });
    } else {
      setblockList([]);
      setloadingAutocompleteBlock(false);
    }
  }

  function handleSubmitBlockDetails(blockNum) {
    setBlock(blockNum);
    setIsDisable(false);
  }

  function handleSubmitParcelDetails(parcelNum) {
    setParcels(parcelNum);
  }

  async function handleInputChangeParcel(text) {
    if (text) {
      // setParcels(text);
      setParcelinputerror(false);
      setloadingAutocompleteParcel(true);

      await api
        .get(`/topfive?blockNum=${block}&parcelNum=${text}`)
        .then((result) => {
          setparcelList(result.data);
          setloadingAutocompleteParcel(false);
        })
        .catch((error) => {
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

  return (
    <Wrapper
      background={backgroundColor}
      height={height}
      wrapperMargin={wrapperMargin}
      wrapperPadding={wrapperPadding}
    >
      {showTitle && <Title color={color}>{t.searchBoxTitle}</Title>}
      <InputWrapper>
        <SelectWrapper>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              label=""
              className={classes.selectControl}
              MenuProps={{ classes: { paper: classes.select } }}
              IconComponent={() => <ExpandMoreIcon />}
            >
              <MenuItem value={'textbox'}>{t.textbox}</MenuItem>
              <MenuItem value={'inputbox'}>{t.inputbox}</MenuItem>
            </Select>
          </FormControl>
        </SelectWrapper>

        {/* // making a State to Show the Input or Selected Icons //  */}
        {selected === 'inputbox' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AutocompleteWrapperItem color={color}>
                <b>{t.block}</b>
                <AutocompleteBlock
                  placeholder={'5643'}
                  id={
                    blockinputerror
                      ? 'block-search-input-error'
                      : 'block-search-input'
                  }
                  inputSuggestions={blockList}
                  onInputChange={(input) => {
                    handleInputChangeBlock(input);
                  }}
                  onFilterChange={(block) => handleSubmitBlockDetails(block)}
                  classes={{ inputRoot: 'text' }}
                  loading={loadingAutocompleteBlock}
                />
              </AutocompleteWrapperItem>
              <AutocompleteWrapperItem color={color}>
                <b>{t.parcel}</b>
                <AutocompleteParcel
                  placeholder={'554'}
                  id={
                    parcelinputerror
                      ? 'parcels-search-input-error'
                      : 'parcels-search-input'
                  }
                  inputSuggestions={parcelList}
                  onInputChange={(input) => {
                    handleInputChangeParcel(input);
                  }}
                  onFilterChange={(parcel) => handleSubmitParcelDetails(parcel)}
                  classes={{ inputRoot: 'text' }}
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
                placeholder={t.searchAddress}
                inputSuggestions={addresses}
                onInputChange={onInputChange}
                onFilterChange={onFilterChange}
                classes={{ inputRoot: 'text' }}
                loading={loadingAutocomplete}
              />
            </AutocompleteWrapper>
            {/* // Button To Handle the Inputs and function of Text Filed //  */}
            <Button type="button" onClick={onGoToPlansClick} color={color}>
              <SearchIcon style={{ fontSize: 24 }} />
            </Button>
          </>
        )}
      </InputWrapper>
    </Wrapper>
  );
}
