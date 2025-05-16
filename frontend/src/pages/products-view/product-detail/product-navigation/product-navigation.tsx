import React, { useEffect, useState } from 'react';
import { Count, NavLink, NavList } from './product-navigation.style';

interface Section {
  id: string;
  label: string;
  count?: number;
}
type ProductNavigationProps = {
  reviewCount?: number;
};
const ProductNavigation = ({ reviewCount }: ProductNavigationProps) => {
  const [activeSection, setActiveSection] = useState('');

  const sections: Section[] = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Product Details' },
    { id: 'reviews', label: 'Reviews', count: reviewCount },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
      },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = React.useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <NavList>
      {sections.map(({ id, label, count = 0 }) => (
        <NavLink key={id} onClick={() => handleClick(id)} active={activeSection === id}>
          {label}
          {count > 0 && <Count>{`(${count})`}</Count>}
        </NavLink>
      ))}
    </NavList>
  );
};
export default ProductNavigation;
