import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    addressText: '',
    addressPlaceId: '',
    parcel: '',
    block: '',
    type: 'searchAddress',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setAddressText(state, type) {
            state.addressText = type.payload.addressText;
            state.addressPlaceId = type.payload.addressPlaceId;
        },
        setBlockNum(state, type) {
            state.block = type.payload.block;
        },
        setParcel(state, type) {
            state.parcel = type.payload.parcel;
        },
        setSearchType(state, type) {
            state.type = type.payload.type;
        },
        resetSearch(state) {
            state = initialState;
        },
    },
});

export const {
    setSearchType,
    resetSearch,
    setBlockNum,
    setParcel,
    setAddressText,
} = searchSlice.actions;

export default searchSlice.reducer;
