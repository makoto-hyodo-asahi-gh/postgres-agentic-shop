import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PRODUCT_DETAIL_API, SEARCH_API } from 'constants/api-urls';
import ProductLayout from 'components/layouts/product-layout';
import { ProductDetailResponse } from 'src/types/product.type';
import ProductInfo from 'components/product-info/product-info';
import ErrorState from 'components/error-state/error-state';
import ProductGallery from 'components/product-gallery/product-gallery';

import { useFetch, useStreamingSearch } from 'services/api-callers';
import { breadcrumbItems } from 'constants/constants';
import isSomething, { getUserIdFromSession } from 'utils/common-functions';
import OverlayWithSpinner from 'components/overlay-with-spinner/overlay-with-spinner';
import ToastService from 'components/toast-notifications/toast-notifications';
import { CenteredNavigation, Container, Grid, Section } from './product-detail.style';
import PersonalizedSection from './personalized-section/personalized-section';
import ProductNavigation from './product-navigation/product-navigation';
import ProductSections from './product-sections/products-sections';

const ProductDetailPage = () => {
  const [contentType, setContentType] = React.useState('product_detail');
  const [workFlowUpdateMessage, setWorkflowUpdateMessage] = React.useState<{
    successMessage?: string;
    streamingMessage?: string;
    memoryMessage?: string;
    icon?: JSX.Element;
  }>({
    successMessage: '',
    streamingMessage: '',
    memoryMessage: '',
    icon: undefined,
  });
  const [enableErrorCorrection, setEnableErrorCorrection] = React.useState(false);

  const { productId } = useParams();
  const searchParam = useRef('');
  const navigate = useNavigate();
  const {
    data: product,
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useFetch<ProductDetailResponse>('product', productId ? PRODUCT_DETAIL_API(Number(productId)) : '');

  const { streamSearch, streamData, isLoading: isStreaming, error: isStreamError } = useStreamingSearch();

  const handleSearch = async (e: React.FormEvent, searchQuery: string) => {
    e.preventDefault();
    searchParam.current = searchQuery;
    const body = { product_id: productId, user_query: searchQuery };
    if (searchQuery.trim()) {
      streamSearch(body, SEARCH_API);
    }
  };
  const [processedMessageTypes, setProcessedMessageTypes] = React.useState({
    personalization_start: false,
    memory_update: false,
    personalization_complete: false,
  });

  const productsList = useMemo(() => {
    if (isSomething(streamData) && streamData?.[0]?.type === 'product_search' && !isStreaming) {
      const searchedProducts = streamData?.[0]?.data?.products;
      return searchedProducts;
    }
    return null;
  }, [isStreaming, streamData]);

  useEffect(() => {
    if (!streamData || streamData.length === 0) return;

    // Create a copy of the current processed message state
    const updatedProcessedMessageTypes = { ...processedMessageTypes };
    let shouldUpdateState = false;

    // Check for personalization workflow starting message
    if (!processedMessageTypes.personalization_start) {
      const personalizationStartMsg = streamData.find(
        (item) =>
          item.type === 'personalization_workflow' &&
          item.data?.message === 'Your personalized section is being generated',
      );

      if (personalizationStartMsg) {
        setWorkflowUpdateMessage({ streamingMessage: personalizationStartMsg.data.message });
        updatedProcessedMessageTypes.personalization_start = true;
        shouldUpdateState = true;
      }
    }

    // Check for memory update message
    if (!processedMessageTypes.memory_update) {
      const memoryMsg = streamData.find((item) => item.type === 'memory');

      if (memoryMsg) {
        // Use setTimeout to ensure this happens after any rendering
        setTimeout(() => {
          ToastService.success(memoryMsg.data.message);
        }, 2000);

        updatedProcessedMessageTypes.memory_update = true;
        shouldUpdateState = true;
      }
    }

    // Check for completion message
    if (!processedMessageTypes.personalization_complete) {
      const completionMsg = streamData.find(
        (item) => item.type === 'personalization_workflow' && item.data?.message?.includes('updated'),
      );

      if (completionMsg) {
        setWorkflowUpdateMessage({
          streamingMessage: '',
          successMessage: completionMsg.data.message,
        });

        updatedProcessedMessageTypes.personalization_complete = true;
        shouldUpdateState = true;

        // Reset success message after 10 seconds
        setTimeout(() => {
          setWorkflowUpdateMessage((prev) => ({ ...prev, successMessage: '' }));
        }, 10000);
      }
    }

    // Update the processed message types state if needed
    if (shouldUpdateState) {
      setProcessedMessageTypes(updatedProcessedMessageTypes);
    }
  }, [streamData, processedMessageTypes]);

  // Reset the processed message types when starting a new stream
  useEffect(() => {
    if (isStreaming === true) {
      // Reset the tracking state when a new stream starts
      setProcessedMessageTypes({
        personalization_start: false,
        memory_update: false,
        personalization_complete: false,
      });
    }
  }, [isStreaming]);

  const personalizationData = useMemo(() => {
    const findPersonalizationKey = () => {
      // Check if data is an array
      if (Array.isArray(streamData)) {
        // Use Array.prototype.find to locate the object with a personalization key
        const itemWithPersonalization = streamData.find(
          (item) => item.data && typeof item.data === 'object' && 'personalization' in item.data,
        );
        return itemWithPersonalization?.data || null;
      }

      // Return null if personalization key is not found
      return null;
    };

    if (isSomething(streamData) && streamData?.[0]?.type === 'personalization_workflow' && !isStreaming) {
      return findPersonalizationKey();
    }
    return null;
  }, [isStreaming, streamData]);

  useEffect(() => {
    if (!isSomething(streamData)) setContentType('product_detail');
    else setContentType(streamData?.[0]?.type);
  }, [streamData]);

  useEffect(() => {
    refetch();
  }, [productId, refetch]);

  useEffect(() => {
    const userId = getUserIdFromSession();
    if (!userId) {
      navigate('/users');
    }
  }, [navigate]);

  useEffect(() => {
    if (contentType === 'product_search') {
      navigate(`/products?searchParam=${searchParam.current}`, {
        state: { productsList, streamData },
      });
    }
  }, [contentType, navigate, productsList, streamData]);

  if (isLoading || isRefetching) return <OverlayWithSpinner />;
  if (error || !product || isStreamError) return <ErrorState />;
  return (
    <ProductLayout
      breadcrumbItems={breadcrumbItems}
      handleSearch={handleSearch}
      infoMessage={workFlowUpdateMessage}
      enableErrorCorrection={enableErrorCorrection}
      setEnableErrorCorrection={setEnableErrorCorrection}
    >
      <Container>
        <Grid>
          <Section>
            <ProductGallery images={product?.images || []} />
            <ProductInfo
              title={product?.name}
              price={product?.price}
              variants={product?.variants}
              rating={product?.average_rating}
            />
          </Section>
          <PersonalizedSection
            personalizationStreamingData={personalizationData}
            enableErrorCorrection={enableErrorCorrection}
          />
        </Grid>
        <CenteredNavigation>
          <ProductNavigation reviewCount={product?.reviews?.length} />
        </CenteredNavigation>
        <ProductSections product={product} />
        {/* <RelatedProducts products={mockRelatedProducts} /> */}
      </Container>

      {/* Loading Overlay */}
      {isStreaming && <OverlayWithSpinner loadingInfoText={workFlowUpdateMessage?.streamingMessage} />}
    </ProductLayout>
  );
};

export default ProductDetailPage;
