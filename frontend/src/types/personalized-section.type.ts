export interface ListCard {
  type: 'list_card';
  title: string;
  items: string[];
}

export interface TextCard {
  type: 'text_card';
  title: string;
  content: string;
  items?: string[];
}

export interface GraphCard {
  type: 'graph';
  title: string;
  x_axis: string[];
  y_axis: number[];
  data: { x: string; y: number }[];
  items?: string[];
}

export interface FeatureCard {
  type: 'feature_card';
  title: string;
  value: string;
  text: string;
  items?: string[];
}

export type PersonalizationItem = ListCard | TextCard | GraphCard | FeatureCard;

export interface PersonalizedSectionResponse {
  personalization: PersonalizationItem[];
}
