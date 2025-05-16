export interface NodeProps {
  data: {
    width?: number;
    label: string;
    icon?: JSX.Element;
    infoIcon?: JSX.Element;
    items?: string[];
    time?: string;
  };
  isConnectable?: boolean;
}
// Define the input data structure based on the JSON structure
export interface InputNode {
  id: string;
  level: string;
  xOffset?: number;
  data: {
    label: string;
    input: unknown;
    output: unknown;
    time?: number;
    icon?: JSX.Element;
    infoIcon?: JSX.Element;
  };
}

export interface InputEdge {
  id: string;
  source: string;
  target: string;
}

export interface InputData {
  nodes: InputNode[];
  edges: InputEdge[];
  user_query_agent_flow: boolean;
}
