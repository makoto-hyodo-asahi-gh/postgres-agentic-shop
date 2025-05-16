import React, { useState } from 'react';
import { BreadcrumbContainer, Layout, Main } from 'components/layouts/product-layout.style';
import Header from 'components/header/header';
import Breadcrumb from 'components/breadcrumbs/breadcrumbs';
import SideDrawer from 'components/side-drawer/side-drawer';
import DebugPanelTabs from 'components/side-drawer/debug-panel-tabs/debug-panel-tabs';
import Footer from 'components/footer/footer';
import { columns, socialLinks, subscribe } from 'components/footer/footer.utils';
import OverlayWithSpinner from 'components/overlay-with-spinner/overlay-with-spinner';
import { postWithUserId } from 'services/api-callers';
import { RESET_API } from 'constants/api-urls';

interface ProductLayoutProps {
  children: React.ReactNode;
  breadcrumbItems: {
    label: string;
    url: string;
  }[];
  handleSearch?: (e: React.FormEvent, searchQuery: string) => void;
  infoMessage?: { successMessage?: string; streamingMessage?: string; memoryMessage?: string; icon?: JSX.Element };
  initialSearchString?: string;
  enableErrorCorrection?: boolean;
  setEnableErrorCorrection?: (value: boolean) => void;
  traceId?: string;
}

const ProductLayout: React.FC<ProductLayoutProps> = ({
  children,
  breadcrumbItems,
  handleSearch,
  infoMessage,
  initialSearchString,
  enableErrorCorrection,
  setEnableErrorCorrection,
  traceId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleOpenDrawer = () => {
    setIsOpen(true);
    setShouldRefetch(true); // Set refetch flag to true only when user explicitly opens drawer
  };

  if (isResetting) return <OverlayWithSpinner />;

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await postWithUserId(RESET_API, {});
    } catch (error) {
      console.error('Error resetting:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Layout>
        <Header
          logo="AgenticShop"
          buttonLabel="Agentic Flow"
          onButtonClick={handleOpenDrawer}
          handleSearch={handleSearch}
          infoMessage={infoMessage}
          initialSearchString={initialSearchString}
        />
        <Main>
          <BreadcrumbContainer>
            <Breadcrumb items={breadcrumbItems} />
          </BreadcrumbContainer>
          {children}
        </Main>
        <Footer
          logo="AgenticShop"
          socialLinks={socialLinks}
          columns={columns}
          handleReset={handleReset}
          subscribe={subscribe}
          copyrightText="Made With Love By Finland All Right Reserved"
        />
      </Layout>

      {isOpen && (
        <SideDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          enableErrorCorrection={enableErrorCorrection}
          setEnableErrorCorrection={setEnableErrorCorrection}
        >
          <DebugPanelTabs traceId={traceId} shouldRefetch={shouldRefetch} setShouldRefetch={setShouldRefetch} />
        </SideDrawer>
      )}
    </>
  );
};

export default ProductLayout;
