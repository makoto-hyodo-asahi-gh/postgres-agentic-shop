import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailPage from 'pages/products-view/product-detail/product-detail';
import ProductsListing from 'pages/products-view/product-listing/products-listing';

const ViewProductsRoute = () => {
  const { productId } = useParams();
  return productId ? <ProductDetailPage key={productId} /> : <ProductsListing key={productId} />;
};
export default ViewProductsRoute;
