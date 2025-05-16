import React from 'react';
import {
  BottomSection,
  Column,
  ColumnLink,
  ColumnTitle,
  ContentSection,
  Copyright,
  Divider,
  EmailInput,
  FooterContainer,
  Logo,
  SmallText,
  SocialIcon,
  SocialIcons,
  SubscribeButton,
  SubscribeForm,
  SubscribeSection,
  TopSection,
} from './footer.style';

interface SocialLink {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

interface ColumnLink {
  href?: string;
  label: string;
  onClick?: () => void;
}

interface ColumnData {
  title: string;
  links: ColumnLink[];
}

interface SubscribeProps {
  title: string;
  placeholder: string;
  buttonLabel: string;
  text: string;
}

interface FooterProps {
  logo: string | React.ReactNode;
  socialLinks: SocialLink[];
  columns: ColumnData[];
  subscribe: SubscribeProps;
  copyrightText: string;
  handleReset?: () => void;
}

const Footer: React.FC<FooterProps> = ({ logo, socialLinks, columns, subscribe, copyrightText, handleReset }) => (
  <FooterContainer>
    <TopSection>
      <Logo>{logo}</Logo>
      <SocialIcons>
        {socialLinks.map((link, index) => (
          <SocialIcon key={index} href={link.href} aria-label={link.ariaLabel}>
            {link.icon}
          </SocialIcon>
        ))}
      </SocialIcons>
    </TopSection>

    <Divider />

    <ContentSection>
      {columns.map((column, index) => (
        <Column key={index}>
          <ColumnTitle>{column.title}</ColumnTitle>
          {column.links.map((link, linkIndex) => (
            <ColumnLink key={linkIndex} href={link.href} onClick={handleReset}>
              {link.label}
            </ColumnLink>
          ))}
        </Column>
      ))}

      <SubscribeSection>
        <ColumnTitle>{subscribe.title}</ColumnTitle>
        <SubscribeForm>
          <EmailInput type="email" placeholder={subscribe.placeholder} />
          <SubscribeButton type="submit">{subscribe.buttonLabel}</SubscribeButton>
        </SubscribeForm>
        <SmallText>{subscribe.text}</SmallText>
      </SubscribeSection>
    </ContentSection>

    <BottomSection>
      <Copyright>{copyrightText}</Copyright>
    </BottomSection>
  </FooterContainer>
);

export default Footer;
