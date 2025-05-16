type AgentNodeData = {
  label: string;
  labelWithCounter?: string;
  input: string | null;
  output: string | null;
  reasoning: string[] | null;
  start_time: string | null;
  end_time: string | null;
  time: number | null;
};
export type AgenticFlowDiagramData = {
  nodes: {
    id: string;
    data: AgentNodeData;
    level: string | null;
    status: string;
    show_in_flow_graph?: boolean;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
  user_query_agent_flow: boolean;
};

export type AgenticNodeItem = AgenticFlowDiagramData['nodes'][number];
