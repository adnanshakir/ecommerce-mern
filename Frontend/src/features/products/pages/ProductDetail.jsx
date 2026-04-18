import React, { use, useEffect } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";

const ProductDetail = () => {
  const { productId } = useParams();

  const { handleGetProductDetails } = useProduct();

  useEffect(() => {
    handleGetProductDetails(productId)
  },[productId]);

  return <div>ProductDetail</div>;
};

export default ProductDetail;
