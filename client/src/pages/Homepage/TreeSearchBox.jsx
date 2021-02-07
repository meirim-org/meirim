import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import _ from "lodash";
import locationAutocompleteApi from '../../services/location-autocomplete';
import { device } from 'style';

const Wrapper = styled.div`
    background-color: #007E6C;
    box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198), 0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275), 0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035), 0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);
    padding: 17px;
    width: 100%;
    height: 130px;
    margin: 16px auto;
    z-index: 1;

    @media ${device.tablet} {
        width: 492px;
        height: 140px;
        padding: 32px;
        margin: 16px 0 0 0;  
        border-radius: 12px;
    }
`;

const Title = styled.p`
    color: #ffffff;
    text-align: right;
    font-size: 22px;
    line-height: 22px;
    margin-bottom: 22px;

    @media ${device.tablet} {
        font-size: 22px;
        line-height: 22px;
        margin-bottom: 22px;
    }
`;

const Button = styled.button`
    margin: left;
    background: transparent;
    width: 120px;
    height: 32px;
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    color: #FFFFFF;
    line-height: 1;
    cursor: pointer;

    @media ${device.tablet} {
        margin-right: 0;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: row-reverse;

    @media ${device.tablet} {
        flex-direction: row-reverse;
        justify-content: space-between;
    }

    .text{
        font-family:Assistant;
    }
`;

export default function TreeSearchBox() {
    const [addresses, setAddresses] = useState([]);
    const [placeId, setPlaceId] = useState('');
    const [loadingAutocomplete, setloadingAutocomplete] = useState(false);

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

    async function onGoToTreesClick() {
		window.location.href = `/trees`;
    }

	useEffect(()=>{
		locationAutocompleteApi.init();
	},[]);

	return (
		<Wrapper>
			<Title>רוצים לשמור על העצים ליד הבית שלכם?</Title>
			<InputWrapper>
				<Button type="button" onClick={onGoToTreesClick}> צפיה בעצים</Button>
			</InputWrapper>
		</Wrapper>
	)
}