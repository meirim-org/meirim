import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import locationAutocompleteApi from '../../services/location-autocomplete';
import Autocomplete from '../../components/AutoCompleteInput';

const Wrapper = styled.div`
    width: 512px;
    height: 160px;
    background-color: #652DD0;
    box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198), 0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275), 0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035), 0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);
    border-radius: 12px;
    padding: 32px;
    margin-top: 113px;
`;

const Title = styled.p`
    color: #ffffff;
    font-family: Assistant;
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
    line-height: 32px;
    text-align: right;
`;

const Button = styled.button`
    background: transparent;
    width: 120px;
    height: 32px;
    border: 1px solid #FFFFFF;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    color: #FFFFFF;
    line-height: 1;
`;

const AutocompleteWrapper = styled.div`
    width: 305px;

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
    justify-content: space-between;
`;

export default function SearchBox() {
	const [addresses, setAddresses] = useState([]);

	async function onInputChange(input) {
		const res = await locationAutocompleteApi.autocomplete(input);
		setAddresses(res);
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
						classes=""
					/>
				</AutocompleteWrapper>
				<Button>צפיה בתוכניות</Button>
			</InputWrapper>
		</Wrapper>
	)
}