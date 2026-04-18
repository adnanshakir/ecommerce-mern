import React, { use, useEffect } from "react";
import { useParams } from "react-router";
import { userProduct } from "../hooks/useProduct";

const ProductDetail = () => {
  const { productId } = useParams();

  const { handleGetProductDetails } = userProduct();

  useEffect(() => {
    handleGetProductDetails(productId)
  },[productId]);

  return <div>ProductDetail</div>;
};

export default ProductDetail;
