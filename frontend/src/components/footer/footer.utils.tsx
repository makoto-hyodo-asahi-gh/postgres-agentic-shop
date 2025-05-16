import React from 'react';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';

export const socialLinks = [
  { href: '#', ariaLabel: 'Facebook', icon: <FacebookOutlined /> },
  { href: '#', ariaLabel: 'Instagram', icon: <InstagramOutlined /> },
  { href: '#', ariaLabel: 'Twitter', icon: <TwitterOutlined /> },
];

export const columns = [
  {
    title: 'Company Info',
    links: [
      { label: 'Reset', hred: '#' },
      { href: '#', label: 'About Us' },
      { href: '#', label: 'Carrier' },
      { href: '#', label: 'We are hiring' },
      { href: '#', label: 'Blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'About Us' },
      { href: '#', label: 'Carrier' },
      { href: '#', label: 'We are hiring' },
      { href: '#', label: 'Blog' },
    ],
  },
  {
    title: 'Features',
    links: [
      { href: '#', label: 'Business Marketing' },
      { href: '#', label: 'User Analytic' },
      { href: '#', label: 'Live Chat' },
      { href: '#', label: 'Unlimited Support' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#', label: 'IOS & Android' },
      { href: '#', label: 'Watch a Demo' },
      { href: '#', label: 'Customers' },
      { href: '#', label: 'API' },
    ],
  },
];

export const subscribe = {
  title: 'Get In Touch',
  placeholder: 'Your Email',
  buttonLabel: 'Subscribe',
  text: 'Lore imp sum dolor Amit',
};
