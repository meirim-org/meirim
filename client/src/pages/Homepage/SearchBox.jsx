import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import locationAutocompleteApi from '../../services/location-autocomplete';
import Autocomplete from '../../components/AutoCompleteInput';
import { device } from 'style';

const Wrapper = styled.div`
    background-color: #652DD0;
    box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198), 0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275), 0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035), 0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);
    padding: 23px;
    width: 100%;
    height: 200px;
    margin: 32px auto;
    z-index: 1;

    @media ${device.tablet} {
        width: 512px;
        height: 160px;
        padding: 32px;
        margin: 32px 0 0 0;  
        border-radius: 12px;
    }
`;

const Title = styled.p`
    color: #ffffff;
    text-align: right;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 28px;

    @media ${device.tablet} {
        font-size: 32px;
        line-height: 32px;
        margin-bottom: 32px;
    }
`;

const Button = styled.button`
    margin-right: auto;
    background: transparent;
    width: 120px;
    height: 32px;
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    color: #FFFFFF;
    line-height: 1;

    @media ${device.tablet} {
        margin-right: 0;
    }
`;

const AutocompleteWrapper = styled.div`
    margin-bottom: 35px;
    width: 100%;

    @media ${device.tablet} {
        margin-bottom: 0;
        width: 305px;
    }

    input[type="text"] {
        color: #FFFFFF;
        font-size: 14px;
        line-height: 18px;

        &::placeholder {
            opacity: 1;
        }
    }

    .MuiPaper-elevation1 {
        border-radius: 0px 0px 12px 12px;
        border: 1px solid #652DD0;
        font-size: 16px;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;

    @media ${device.tablet} {
        flex-direction: row;
        justify-content: space-between;
    }
`;

export default function SearchBox() {
    const [addresses, setAddresses] = useState([]);
    const [placeId, setPlaceId] = useState('');

	async function onInputChange(input) {
        const res = await locationAutocompleteApi.autocomplete(input);
		setAddresses(res);
    }
    
    function onFilterChange(data) {
        if (data) {
            const place = addresses.find(address => address.label === data);
            if (place) {
                setPlaceId(place.id);
            }
        }
    }

    async function onGoToPlansClick() {
        const { lat, lng } = await locationAutocompleteApi.getPlaceLocation(placeId);
        window.location.href = `/plans?loc=${lat},${lng}`;
    }

	useEffect(()=>{
		locationAutocompleteApi.init();
	},[]);

	return (
		<Wrapper>
			<Title>סקרנים מה בונים לכם ליד הבית?</Title>
			<InputWrapper>
				<AutocompleteWrapper>
					<Autocomplete 
						placeholder="חפשו כתובת"
						inputSuggestions={addresses}
                        onInputChange={onInputChange}
                        onFilterChange={onFilterChange}
						classes=""
					/>
				</AutocompleteWrapper>
				<Button type="button" onClick={onGoToPlansClick}>צפיה בתוכניות</Button>
			</InputWrapper>
		</Wrapper>
	)
}