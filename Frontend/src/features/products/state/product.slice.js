import { createSlice } from "@reduxjs/toolkit";
import { p } from "node_modules/react-router/dist/development/index-react-server-client-WSaoxloq.mjs";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProduct: [],
    products: [],
    productDetails: null,
  },

  reducers: {
    setProduct: (state, action) => {
      state.sellerProduct = action.payload;
    },
    setAllProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
  },
});

export const { setProduct, setAllProducts } = productSlice.actions;

export default productSlice.reducer;
