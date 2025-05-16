/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import { useFetch } from 'services/api-callers';
import { DEBUG_PANEL_API, QUERY_FLOW_API } from 'constants/api-urls';
import { useParams } from 'react-router-dom';
import FlowDiagram from 'components/agentic-flow-digram/agentic-flow-diagram';
import AgentContent from 'components/agent-tab-detail/agent-tab-detail';
import ErrorState from 'components/error-state/error-state';
import { AgenticFlowDiagramData, AgenticNodeItem } from 'components/agentic-flow-digram/agentic-flow-diagram.type';
import Loader from 'components/loader/loader';
import NoDataState from 'components/no-data-state/no-data-state';
import { AgentFlowIcon } from 'constants/icon-svgs';
import StyledTabs from './debug-panel-tabs.style';

interface DebugPanelTabsProps {
  traceId?: string;
  shouldRefetch: boolean;
  setShouldRefetch: (value: boolean) => void;
}

const DebugPanelTabs = ({ traceId, shouldRefetch, setShouldRefetch }: DebugPanelTabsProps) => {
  const { productId } = useParams();

  const {
    data: debugPanelData,
    isLoading: debugPanelDataLoading,
    error,
    isRefetching,
  } = useFetch<AgenticFlowDiagramData>('product-debug', DEBUG_PANEL_API(Number(productId)), {
    cache: !shouldRefetch,
    enabled: !!productId && !traceId,
  });

  const {
    data: queryFlowData,
    isLoading: queryFlowDataLoading,
    error: queryFlowDataError,
    isRefetching: isQueryFlowRefetching,
  } = useFetch<AgenticFlowDiagramData>('search-flow', QUERY_FLOW_API(traceId), {
    cache: false,
    enabled: !!traceId,
  });

  // Reset the refetch flag after the fetch is complete
  React.useEffect(() => {
    if (!isRefetching && shouldRefetch) {
      setShouldRefetch(false);
    }
  }, [isRefetching, setShouldRefetch, shouldRefetch]);

  const sourceData = traceId ? queryFlowData : debugPanelData;

  const labelCounter: any = {};

  const filteredDebugPanelTabs = sourceData?.nodes?.reduce((acc: AgenticNodeItem[], node: AgenticNodeItem) => {
    if (node?.status === 'not_triggered') return acc;
    const nodeData = node;
    if (labelCounter[node?.data?.label] || ['Review Agent', 'Evaluation Agent'].includes(node?.data?.label)) {
      labelCounter[node?.data?.label] = labelCounter[node?.data?.label] || 0;
      // eslint-disable-next-line no-plusplus
      nodeData.data.labelWithCounter = `${nodeData?.data?.label} (${++labelCounter[nodeData?.data?.label]})`;
    } else {
      labelCounter[nodeData?.data?.label] = 1;
      nodeData.data.labelWithCounter = nodeData?.data?.label;
    }
    acc.push(nodeData);
    return acc;
  }, []);

  const searchAgentsList = useMemo(
    () =>
      filteredDebugPanelTabs?.reduce(
        (acc: string[], node: AgenticNodeItem) => {
          const agent = node?.data?.label;

          if (agent && !acc.includes(agent)) {
            acc.push(agent);
          }
          return acc;
        },
        ['Agentic Flow'],
      ),
    [filteredDebugPanelTabs],
  );
  const debugAgentsList = useMemo(() => {
    // First, collect all nodes with the same label into groups
    const agentGroups = filteredDebugPanelTabs?.reduce(
      (groups: Record<string, { id: string; label: string }[]>, node: AgenticNodeItem) => {
        const label = node?.data?.label;
        const id = node?.id;

        if (label && id) {
          if (!groups[label]) {
            // eslint-disable-next-line no-param-reassign
            groups[label] = [];
          }
          groups[label].push({ id, label });
        }
        return groups;
      },
      {},
    );

    // For each group, sort by ID and create labeled entries
    const result: string[] = ['Agentic Flow'];

    Object.entries(agentGroups || {}).forEach(([label, agents]) => {
      // Sort the agents by ID in ascending order
      // eslint-disable-next-line radix
      agents.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      // Add labeled entries to the result with sequential numbers
      if (agents.length === 1) {
        // If there's only one agent with this label, don't add a number
        result.push(label);
      } else {
        // If there are multiple agents with this label, add sequential numbers
        agents.forEach((agent, index) => {
          result.push(`${label} (${index + 1})`);
        });
      }
    });

    return result;
  }, [filteredDebugPanelTabs]);

  const agentsList = traceId ? searchAgentsList : debugAgentsList;

  const filteredData = React.useMemo(() => {
    // Create a deep copy of the data to avoid mutating the original
    const filteredDataCopy = debugPanelData && JSON.parse(JSON.stringify(debugPanelData));

    if (filteredDataCopy?.nodes) {
      // Get IDs of filtered nodes to filter edges accordingly
      const filteredNodeIds = filteredDataCopy.nodes.map((node: any) => node.id);

      // Filter edges to only include those connecting filtered nodes
      if (filteredDataCopy?.edges) {
        filteredDataCopy.edges = filteredDataCopy.edges.filter(
          (edge: any) => filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target),
        );
      }
    }

    return filteredDataCopy;
  }, [debugPanelData]);
  console.log('agentsList', agentsList, 'filteredDebugPanelTabs', filteredDebugPanelTabs);
  const tabItems = useMemo(
    () =>
      agentsList?.map((agent: string, index: number) => ({
        key: (index + 1).toString(),
        label: agent,
        children:
          index === 0 ? (
            <FlowDiagram data={traceId ? queryFlowData : filteredData} traceId={traceId} />
          ) : (
            <AgentContent
              data={
                filteredDebugPanelTabs?.find((tab) => tab?.data?.labelWithCounter === agent) || {
                  data: { label: '', input: [], output: [] },
                }
              }
            />
          ),
      })),
    [agentsList, filteredData, filteredDebugPanelTabs, queryFlowData, traceId],
  );

  if (debugPanelDataLoading || isRefetching || queryFlowDataLoading || isQueryFlowRefetching) {
    return <Loader />;
  }

  if (error || queryFlowDataError) return <ErrorState />;
  if (!traceId && !productId) {
    return <NoDataState icon={<AgentFlowIcon />} message="Personalization not applicable for current page!" />;
  }

  return (
    <StyledTabs>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </StyledTabs>
  );
};

export default DebugPanelTabs;
