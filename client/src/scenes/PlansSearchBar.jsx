import React, { useState } from 'react';
import { SearchBarWrapper, Label, Filters } from './PlansSearchBar.styled';
import Autocomplete from "../components/Autocomplete/Autocomplete";
import FilterBox from "../components/FilterBox/FilterBox";
import InfoBadge from "../components/InfoBadge/InfoBadge";
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg';
import t from "../locale/he_IL";
import { colors } from 'style';
import { useEffect } from 'react';

const PLAN_STATUS = {
    IN_PROGRESS: 'IN_PROGRESS',
    APPROVED: 'APPROVED'
}

function PlansSearchBar({
    autocompleteList,
    onAddressSubmit,
    onInputChange
}) {
    const [address, setAddress] = useState(undefined);
    const [planStatus, setPlanStatus] = useState(new Set([PLAN_STATUS.IN_PROGRESS]));

    useEffect(() => {
        if (address) {
            onAddressSubmit(address, planStatus);
        }
    }, [address, planStatus, onAddressSubmit]);

    const toggleStatus = (status) => {
        if (planStatus.has(status)) {
            if (planStatus.size > 1) {
                setPlanStatus(prev => {
                    const newStatus = new Set(prev)
                    newStatus.delete(status);
                    return newStatus;
                });
            }
        } else {
            setPlanStatus(prev => new Set(prev).add(status));
        }
    }

    const handleInProgressToggle = () => {
        toggleStatus(PLAN_STATUS.IN_PROGRESS);
    }
    const handleApprovedToggle = () => {
        toggleStatus(PLAN_STATUS.APPROVED);
    }

    const handleFilter = (value) => {
        setAddress(value);
    }

    const handleInputChange = (value) => {
        onInputChange(value);
    };

    return (<SearchBarWrapper>
        <Autocomplete
            placeholder={t.searchAddressOrCity}
            width='327px'
            items={autocompleteList}
            onFilter={handleFilter}
            onInputChange={handleInputChange}
            icon={<SearchIcon />} />
        <Label>{t.showPlans} <InfoBadge text={t.showPlansTooltip} /></Label>
        <Filters>
            <FilterBox
                selected={planStatus.has(PLAN_STATUS.IN_PROGRESS)}
                label={t.inProgress}
                chipColor={colors.purple[300]}
                onToggle={handleInProgressToggle} />
            <FilterBox
                selected={planStatus.has(PLAN_STATUS.APPROVED)}
                label={t.approved}
                chipColor={colors.blue}
                onToggle={handleApprovedToggle} />
        </Filters>
    </SearchBarWrapper>);
}

export default PlansSearchBar;