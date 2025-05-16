import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbContainer, BreadcrumbItem } from './breadcrumbs.style';

interface BreadcrumbItemProps {
  label: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <BreadcrumbContainer>
    {items.map((item, index) => (
      <BreadcrumbItem key={index}>
        <Link to={item.url}>{item.label}</Link>
      </BreadcrumbItem>
    ))}
  </BreadcrumbContainer>
);

export default Breadcrumb;
