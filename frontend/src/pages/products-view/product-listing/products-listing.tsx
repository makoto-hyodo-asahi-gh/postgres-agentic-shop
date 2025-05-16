import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from 'components/product-card/product-card';
import ProductLayout from 'components/layouts/product-layout';
import { PRODUCT_LIST_API, SEARCH_API } from 'constants/api-urls';
import ErrorState from 'components/error-state/error-state';
import { useFetch, useStreamingSearch } from 'services/api-callers';
import isSomething from 'utils/common-functions';
import NoDataState from 'components/no-data-state/no-data-state';
import OverlayWithSpinner from 'components/overlay-with-spinner/overlay-with-spinner';
import { NoResultFoundIcon } from 'constants/icon-svgs';
import { LoadMore, ProductGrid } from './product-listing.style';
import { Product } from './product-listing.types';

const PAGE_SIZE = 8; // Number of products per page

interface ProductListResponse {
  total: number;
  products: Product[];
  page: number;
  page_size: number;
}

const ProductsListing = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [traceId, setTraceId] = useState('');
  const location = useLocation();
  const productsListState = location.state?.productsList;
  const streamDataState = location.state?.streamData;
  const [products, setProducts] = useState<Product[]>(productsListState || []);

  const searchQueryInParam = searchParams.get('searchParam') || '';
  const previousSearchRef = useRef(searchQueryInParam);
  const searchRef = useRef(false);
  const [searchInputValue, setSearchInputValue] = useState(searchQueryInParam);
  const navigate = useNavigate();
  const {
    data: productsData,
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useFetch<ProductListResponse>(`productList-${page}`, PRODUCT_LIST_API(page, PAGE_SIZE), {
    enabled: !searchQueryInParam,
  });
  const { streamSearch, streamData, isLoading: isStreaming, error: isStreamError } = useStreamingSearch();
  const sourceData = isSomething(streamData) ? streamData : streamDataState;

  const productsList = useMemo(() => {
    if (isSomething(sourceData) && sourceData?.[0]?.type === 'product_search') {
      const searchedProducts = sourceData?.[0]?.data?.products;
      return searchedProducts;
    }
    return null;
  }, [sourceData]);

  const handleSearch = async (e: React.FormEvent, searchQuery: string) => {
    e.preventDefault();
    searchRef.current = true;
    setSearchInputValue(searchQuery);
    navigate(
      {
        pathname: location.pathname,
        search: `?searchParam=${encodeURIComponent(searchQuery)}`,
      },
      { replace: false },
    ); // This 'replace: false' is crucial - it adds a new history entry
    const body = { user_query: searchQuery };
    if (searchQuery.trim()) {
      streamSearch(body, SEARCH_API);
    }
  };

  useEffect(() => {
    if (searchQueryInParam && !isStreaming) {
      const body = { user_query: searchQueryInParam };
      streamSearch(body, SEARCH_API);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update search input value to match URL parameter
    setSearchInputValue(searchQueryInParam);

    if (!searchRef.current) {
      if (searchQueryInParam && previousSearchRef.current !== searchQueryInParam) {
        const body = { user_query: searchQueryInParam };
        streamSearch(body, SEARCH_API);
        previousSearchRef.current = searchQueryInParam;
      }
    } else searchRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQueryInParam]);

  useEffect(() => {
    if (!searchQueryInParam && previousSearchRef.current !== searchQueryInParam) {
      // Reset to default product listing
      setPage(1);
      setProducts((prevProducts) =>
        page === 1 ? (productsData?.products ?? []) : [...prevProducts, ...(productsData?.products ?? [])],
      );
      previousSearchRef.current = '';
    }
  }, [page, productsData, searchQueryInParam, sourceData]);

  useEffect(() => {
    if (!searchQueryInParam) refetch();
  }, [refetch, searchQueryInParam]);

  useEffect(() => {
    if (productsData && !isSomething(sourceData) && !isStreaming && !searchQueryInParam) {
      setProducts((prevProducts) =>
        page === 1 ? productsData?.products : [...prevProducts, ...productsData.products],
      );
      setTotalProducts(productsData.total);
      setIsLoadingMore(false);
    }
  }, [isStreaming, page, productsData, productsList, searchQueryInParam, sourceData, totalProducts]);

  useEffect(() => {
    if (isSomething(productsList) && isSomething(sourceData)) {
      setProducts(productsList);
      setTotalProducts(productsList.length);
      setTraceId(sourceData[0]?.data?.trace_id);
    } else if (!isSomething(productsList) && isSomething(productsData) && isSomething(sourceData)) {
      setProducts([]);
      setTotalProducts(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList]);
  const hasMoreProducts = products?.length < totalProducts;

  const loadMoreProducts = () => {
    if (hasMoreProducts) {
      setIsLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };
  if (isLoading && page === 1) return <OverlayWithSpinner />;
  if (error || isStreamError) return <ErrorState />;
  return (
    <div>
      {(isStreaming || isRefetching) && <OverlayWithSpinner />}
      <ProductLayout
        breadcrumbItems={[]}
        handleSearch={handleSearch}
        initialSearchString={searchInputValue}
        traceId={traceId}
      >
        {!isSomething(products) && !isStreaming && !isLoading ? (
          <NoDataState title="Oops!" icon={<NoResultFoundIcon />} message="No results found" />
        ) : (
          <>
            <ProductGrid>
              {products.map((product) => (
                <ProductCard
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  category={product.category}
                  images={product.images}
                  price={product.price}
                  averageRating={product.average_rating}
                />
              ))}
            </ProductGrid>

            {hasMoreProducts && (
              <LoadMore onClick={loadMoreProducts} disabled={isLoadingMore}>
                {isLoadingMore ? 'Loading...' : 'Load More Products'}
              </LoadMore>
            )}
          </>
        )}
      </ProductLayout>
    </div>
  );
};

export default ProductsListing;
