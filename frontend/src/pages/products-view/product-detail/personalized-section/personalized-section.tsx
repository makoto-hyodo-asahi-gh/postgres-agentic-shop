import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { AIIcon } from 'constants/icon-svgs';
import Dialog from 'components/dialog/dialog';
import TitleWithText from 'components/title-with-text/title-with-text';
import ListRenderer from 'components/list-renderer/list-renderer';
import { usePost } from 'services/api-callers';
import { PERSONALIZED_SECTION_API } from 'constants/api-urls';
import { useParams } from 'react-router-dom';
import { PersonalizedSectionResponse } from 'src/types/personalized-section.type';
import ErrorState from 'components/error-state/error-state';
import isSomething from 'utils/common-functions';
import { Header, Heading, Section, Title, WhyLink } from './personalized-section.style';
import FeaturesGrid from './features-grid/features-grid';

interface PersonalizedSectionProps {
  personalizationStreamingData?: PersonalizedSectionResponse;
  enableErrorCorrection?: boolean;
}
const PersonalizedSection = ({ personalizationStreamingData, enableErrorCorrection }: PersonalizedSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalizedSectionData, setPersonalizedSectionData] = useState<PersonalizedSectionResponse>();
  const { productId } = useParams();

  const {
    refetch: fetchPersonalizedSection,
    data: personalizedSection,
    isLoading,
    error,
    isRefetching,
  } = usePost<PersonalizedSectionResponse>(
    `product-personalization-${productId}`,
    PERSONALIZED_SECTION_API(Number(productId)),
    { fault_correction: enableErrorCorrection },
  );

  useEffect(() => {
    if (isSomething(personalizationStreamingData)) {
      setPersonalizedSectionData(personalizationStreamingData);
    }
  }, [personalizationStreamingData]);

  useEffect(() => {
    setPersonalizedSectionData(personalizedSection);
  }, [personalizedSection]);

  useEffect(() => {
    fetchPersonalizedSection();
  }, [fetchPersonalizedSection, enableErrorCorrection]);

  const featureCardsData = personalizedSectionData?.personalization?.filter((item) => item?.type === 'feature_card');
  const textCardsData = personalizedSectionData?.personalization?.filter((item) => item?.type === 'text_card');
  const listCardsData = personalizedSectionData?.personalization
    ?.filter((item) => item?.type === 'list_card' && Array.isArray(item.items))
    ?.map((item) => ({
      ...item,
      items: item.items || [], // Ensure items is always a string[]
    }));

  if (error) return <ErrorState />;

  return (
    <>
      <Section>
        <Header>
          <Title>
            <AIIcon />
            <Heading>Your Personalized Section</Heading>
          </Title>
        </Header>
        {isLoading || isRefetching ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <>
            {featureCardsData && <FeaturesGrid features={featureCardsData} />}
            {/* commenting till backend work is pending */}
            {/* <ComponentCardWrapper>
              <ChartTitle>Price over time</ChartTitle>
              <PriceChart config={chartConfig} />
            </ComponentCardWrapper> */}
            {listCardsData && <ListRenderer listItems={listCardsData} />}
            {textCardsData && (
              <TitleWithText
                textData={textCardsData.map((item) => ({
                  ...item,
                  content: item.content || '',
                }))}
              />
            )}
          </>
        )}
        <div className="right-align">
          <WhyLink onClick={() => setIsModalOpen(true)}>Why am I seeing this? </WhyLink>
        </div>
      </Section>
      <Dialog
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={null}
        title="Why am I seeing this?"
        content="This content is AI-generated based on available data and personalization based on that data. While we strive for
        accuracy, AI can sometimes make mistakes or misinterpret information. If something seems off, please let us
        know!"
      />
    </>
  );
};
export default PersonalizedSection;
