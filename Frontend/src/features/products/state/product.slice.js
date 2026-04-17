import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProduct: [],
    },

    reducers: {
        setProduct: (state, action) => {
            state.sellerProduct = action.payload;
        },
    },
});

export const { setProduct } = productSlice.actions;

export default productSlice.reducer;