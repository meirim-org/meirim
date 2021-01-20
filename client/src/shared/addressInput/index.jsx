import React, { useState, useEffect } from 'react';
import _ from "lodash";
import locationAutocompleteApi from 'services/location-autocomplete';
import Autocomplete from 'components/AutoCompleteInput';
import * as SC from './style';
import PropTypes from 'prop-types';
import { Label, HelperText} from 'shared';



const AddressInput = ({ id, label, helperText }) => {
    const [addresses, setAddresses] = useState([]);
    const [placeId, setPlaceId] = useState('');

    const getAutocompleteSuggestions = _.debounce(async (input) => {
        const res = await locationAutocompleteApi.autocomplete(input);
        setAddresses(res);
    }, process.env.CONFIG.geocode.autocompleteDelay);

    async function onInputChange(input) {
        if (input) {
            getAutocompleteSuggestions(input);
        } else {
            // cancel pending calls and clear results
            getAutocompleteSuggestions.cancel();
            setAddresses([]);
        }
    }
    
    function onFilterChange(data) {
        if (data) {
            const place = addresses.find(address => address.label === data);
            if (place) {
                setPlaceId(place.id);
            }
        }
    } 
    
	useEffect(()=>{
		locationAutocompleteApi.init();
	},[]);

	return (
		<>
        	<Label id={`${id}-label`} text={label}/>
            <SC.AutocompleteWrapper>
                <Autocomplete 
                    placeholder="חפשו כתובת"
                    inputSuggestions={addresses}
                    onInputChange={onInputChange}
                    onFilterChange={onFilterChange}
                    classes=""
                />
            </SC.AutocompleteWrapper>
            {
				helperText && <HelperText id={`${id}-helperText`} text={helperText}/>
			}
		</>
	)
}


AddressInput.defaultProps = {
	helperText: '',
	label: '',
};

AddressInput.propTypes = {
	id: PropTypes.string.isRequired,
	helperText: PropTypes.string,
	label: PropTypes.string,
};

export default AddressInput;
