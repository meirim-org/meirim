import React, { useState, useEffect } from 'react';
import _ from "lodash";
import locationAutocompleteApi from 'services/location-autocomplete';
import Autocomplete from 'components/AutoCompleteInput';
import * as SC from './style';
import PropTypes from 'prop-types';
import { Label, HelperText} from 'shared';



const AddressInput = ({ id, label, helperText, setAddress }) => {
    const [addresses, setAddresses] = useState([]);

    const getAutocompleteSuggestions = _.debounce(async (input) => {
        const res = await locationAutocompleteApi.autocomplete(input);
        setAddresses(res);
    }, process.env.CONFIG.geocode.autocompleteDelay);

    async function onInputChange(input) {
        if (input) {
            getAutocompleteSuggestions(input);
            setAddress(input);
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
                setAddress(place.label);
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
	setAddress: PropTypes.func.isRequired,
};

export default AddressInput;
