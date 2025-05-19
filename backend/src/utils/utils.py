import ast
import csv
import hashlib
import json
import textwrap

import json5
import regex as re
from mem0 import Memory
from sqlalchemy.ext.asyncio import AsyncSession
from src.logger import logger
from src.models.products import PersonalizedProductSection
from src.repository.personalized_product_section import PersonalizedProductRepository
from src.schemas.agents import UserQueryAgentResponse
from src.schemas.enums import AgentNames, StatusEnum


def add_user_preference_to_memory_during_migration(data: list, memory: Memory) -> None:
    for row in data:
        user_id = row.get("id")
        user_preferences = row.get("preferences")
        for id, preference in enumerate(user_preferences, start=1):
            logger.info(
                f"Adding user preference '{preference}' for user_id: {user_id} in memory",
            )
            output = memory.add(
                messages=preference,
                user_id=str(user_id),
            )
            logger.info(f"Output from mem0={str(output)}")


def load_csv_data(file_path: str) -> list:
    with open(file_path, "r", encoding="utf-8") as file:
        reader = list(csv.DictReader(file))
        data = [parse_json_fields(row) for row in reader]
    return data


def parse_json_fields(row: dict) -> dict:
    for key, value in row.items():
        try:
            row[key] = json.loads(value)
        except json.JSONDecodeError:
            pass
    return row


def parse_json(json_str: str) -> dict:
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {}


def get_user_session_key(user_id: int) -> str:
    return hashlib.sha256(
        f"user_id={user_id}".encode(),
    ).hexdigest()


def get_user_chat_agent_response(agent_response: UserQueryAgentResponse) -> dict:
    """
    Only return attributes that are not None.
    """
    return {
        key: getattr(agent_response, key) for key in agent_response.model_fields_set
    }


def create_placeholder_node(
    label: str,
    id_counter: int,
    level: int,
    type_of_node: str = "",
) -> dict:
    """
    Creates ann empty dictionary for the tool which is not called
    """

    if type_of_node == "tool":
        label = "Tool: " + label

    return {
        "id": str(id_counter),
        "data": {
            "label": label,
            "input": None,
            "output": None,
            "start_time": None,
            "reasoning": [],
            "end_time": None,
            "time": None,
        },
        "level": str(level),
        "status": "not_triggered",
    }


def parse_search_trace_to_flow(
    spans: dict,
    add_tool_placeholder: bool = True,
    generate_edges: bool = True,
) -> dict:
    tools_mapping = {
        "query_reviews_with_sentiment": "Search with Sentiment",
        "search_products": "Search",
        "query_about_product": "Personalization Command",
    }

    tools_not_called = ["Search with Sentiment", "Search", "Personalization Command"]

    extracted_data = []
    id_counter = 1
    user_query_agent_input_message = None
    user_query_agent_tool_called = None
    user_query_agent_execution_time = None

    for span_id, span_name in spans["name"].items():
        parent_id = spans["parent_id"].get(span_id)
        # extract input and output message of user query agent from main workflow.run span
        if span_name == "Workflow.run" and parent_id is None:
            current_span_output = spans.get("attributes.output.value", {}).get(span_id)
            if current_span_output:
                current_agent_name = json.loads(current_span_output).get(
                    "current_agent_name",
                    "",
                )
                if current_agent_name != AgentNames.USER_QUERY_AGENT.value:
                    continue

                user_query_agent_input_message = (
                    json.loads(spans["attributes.input.value"].get(span_id, ""))
                    .get("kwargs", "")
                    .get("user_msg", "")
                )
                user_query_agent_tool_called = (
                    json.loads(spans["attributes.output.value"].get(span_id, ""))
                    .get("tool_calls")[0]
                    .get("tool_name", "")
                )

        # extract execution time for user query agent
        if span_name == "AgentWorkflow.run_agent_step":
            start_time = spans["start_time"].get(span_id)
            end_time = spans["end_time"].get(span_id)
            user_query_agent_execution_time = (end_time - start_time).total_seconds()

            current_agent_name = json.loads(
                spans.get("attributes.output.value", {}).get(span_id, {}),
            ).get("current_agent_name", "")
            if current_agent_name != AgentNames.USER_QUERY_AGENT.value:
                continue

            # Add the extracted span data for User Query Agent
            if (
                user_query_agent_input_message
                and user_query_agent_tool_called
                and user_query_agent_execution_time
            ):
                item = {
                    "id": str(id_counter),
                    "data": {
                        "label": "Command Routing Agent",
                        "input": user_query_agent_input_message,
                        "output": "Tool called: " + user_query_agent_tool_called,
                        "reasoning": [],
                        "start_time": start_time,
                        "end_time": end_time,
                        "time": user_query_agent_execution_time,
                    },
                    "level": str(id_counter),
                    "status": "triggered",
                }
                extracted_data.append(item)
                id_counter += 1

        # Add the extracted span data for the tool that is being triggered by the User Query Agent
        if span_name == "FunctionTool.acall":

            tool_called = json.loads(
                spans["attributes.output.value"].get(span_id, ""),
            ).get("tool_name", "")

            if tool_called not in tools_mapping.keys():
                continue

            arguments = json.loads(
                spans["attributes.input.value"].get(span_id, ""),
            ).get("kwargs")
            arguments = json.dumps(arguments, indent=4, ensure_ascii=False)

            time = (
                spans["end_time"][span_id] - spans["start_time"][span_id]
            ).total_seconds()

            if tool_called == "query_about_product":
                time = 0.2

            item = {
                "id": str(id_counter),
                "data": {
                    "label": "Tool: " + tools_mapping.get(tool_called, ""),
                    "input": arguments,
                    "output": None,
                    "reasoning": [],
                    "start_time": spans["start_time"].get(span_id),
                    "end_time": spans["end_time"].get(span_id),
                    "time": time,
                },
                "level": str(id_counter),
                "status": "triggered",
            }
            tools_not_called.remove(tools_mapping.get(tool_called, ""))
            extracted_data.append(item)
            id_counter += 1

            level = id_counter - 1

    if add_tool_placeholder:
        for tool in tools_not_called:
            unused_tool_node = create_placeholder_node(
                tool,
                id_counter,
                level,
                type_of_node="tool",
            )
            extracted_data.append(unused_tool_node)
            id_counter += 1

    edges = []
    if generate_edges:
        edges = _generate_edges(extracted_data)
    return {"nodes": extracted_data, "edges": edges}


def parse_trace_to_flow(spans: dict) -> list[dict]:
    """
    Parses trace data into a graph structure for visualization.

    Args:
        spans (dict): Trace data containing spans.
    Returns:
        dict: A dictionary with:
            - "nodes": List of extracted spans with metadata for visualization.
            - "edges": List of edges representing execution flow between nodes.
            - "data": Dictionary containing data for each label mapping key.
    """
    id_counter = 1
    current_level = 0
    search_flow_graph = parse_search_trace_to_flow(
        spans,
        add_tool_placeholder=False,
        generate_edges=False,
    )

    extracted_data = search_flow_graph.get("nodes", [])
    user_query_agent_flow = True if extracted_data else False
    if extracted_data:
        id_counter = int(extracted_data[-1].get("id", 0)) + 1
        current_level = int(extracted_data[-1].get("id", 0))

    optional_agents = [
        "Inventory Agent",
        "Product Personalization Agent",
        "Review Agent",
    ]

    label_mapping = {
        "MultiAgentFlow.planning": "Planning Agent",
        "MultiAgentFlow.inventory_analysis": "Inventory Agent",
        "MultiAgentFlow.personalize_product": "Product Personalization Agent",
        "MultiAgentFlow.review": "Review Agent",
        "MultiAgentFlow.evaluate_output": "Evaluation Agent",
        "MultiAgentFlow.presentation": "Presentation Agent",
    }

    agents_trace_captured = []
    span_items = spans["name"].items()

    # Extracting input and output of agents from the respective spans #
    for span_id, span_name in span_items:

        # Fetch the workflow.run span and make sure it contains valid input and output values
        if span_name == "Workflow.run" and (
            spans["attributes.output.value"].get(span_id)
            and spans["attributes.input.value"].get(span_id)
        ):

            parent_agent_id = spans["parent_id"].get(span_id)
            parent_agent_name = spans["name"].get(parent_agent_id)
            status_message = spans["status_message"].get(span_id, "")
            start_time = spans["start_time"].get(parent_agent_id)
            end_time = spans["end_time"].get(parent_agent_id)

            if parent_agent_name not in label_mapping:
                continue

            # extract input and output values
            try:
                inputs = json.loads(
                    spans["attributes.input.value"].get(span_id, ""),
                )
                outputs = json.loads(
                    spans["attributes.output.value"].get(span_id, ""),
                )

                user_input_message = inputs.get("kwargs", "").get("user_msg", "")
                user_output_response = (
                    outputs.get("response", "").get("blocks")[0].get("text", "")
                )

                # prettify
                user_input_message = _print_pretty_with_embedded_json(
                    user_input_message,
                )
                user_output_response = _print_pretty_with_embedded_json(
                    user_output_response,
                )
                json_block = extract_json_blocks(user_output_response)
                if json_block:
                    user_output_response = json_block[0]
            except Exception as e:
                logger.exception(e)
                continue

            # extract reasoning if present
            reasoning = []
            try:
                parsed_output = json.loads(user_output_response)
                if isinstance(parsed_output, dict) and "reasoning" in parsed_output:
                    reasoning = parsed_output.pop("reasoning")
                    user_output_response = json.dumps(
                        parsed_output,
                        indent=4,
                        ensure_ascii=False,
                    )

            except Exception:
                pass

            if "WorkflowTimeoutError" not in status_message:
                status = "triggered"
            else:
                status = "not_triggered"

            item = {
                "id": str(id_counter),
                "data": {
                    "label": label_mapping.get(parent_agent_name),
                    "input": user_input_message,
                    "output": user_output_response,
                    "reasoning": reasoning,
                    "start_time": spans["start_time"][span_id],
                    "end_time": spans["end_time"][span_id],
                    "time": (end_time - start_time).total_seconds(),
                },
                "status": status,
            }

            agents_trace_captured.append(label_mapping.get(parent_agent_name))
            extracted_data.append(item)
            id_counter += 1

    extracted_data, current_level, parallel_agents_level = _assign_level_to_agents(
        extracted_data,
    )

    extracted_data = _add_missing_optional_agents_nodes(
        extracted_data,
        agents_trace_captured,
        optional_agents,
        parallel_agents_level,
    )
    extracted_data = _add_workflow_complete_node(
        extracted_data,
        spans,
        current_level,
        user_query_agent_flow,
    )
    extracted_data = _reorder_parallel_nodes(extracted_data)
    edges = _generate_edges(extracted_data)

    return {
        "nodes": extracted_data,
        "edges": edges,
        "user_query_agent_flow": user_query_agent_flow,
    }


def _add_missing_optional_agents_nodes(
    extracted_data: list[dict],
    agents_trace_captured: list[str],
    parallel_agents: list[str],
    agent_level: str,
):
    if len(extracted_data) > 0:
        last_node = extracted_data.pop()
        id_counter = len(extracted_data) + 1
        for agent in parallel_agents:
            if agent not in agents_trace_captured:
                extracted_data.append(
                    create_placeholder_node(
                        label=agent,
                        id_counter=id_counter,
                        level=agent_level,
                    ),
                )
                id_counter += 1

        # Reassign the last node to the new id
        last_node["id"] = str(id_counter)
        extracted_data.append(last_node)
    return extracted_data


def _add_workflow_complete_node(
    extracted_data: list[dict],
    spans: dict,
    current_level: int,
    user_query_agent_flow: bool,
) -> list[dict]:

    workflow_spans = [
        span_id
        for span_id, span_name in spans["name"].items()
        if span_name.startswith("Workflow.run")
        and spans["parent_id"].get(span_id) is None
    ]

    multi_agent_workflow_span_id = None
    if user_query_agent_flow:
        multi_agent_workflow_span = [
            spans["parent_id"][span_id]
            for span_id, span_name in spans["name"].items()
            if span_name == "MultiAgentFlow.planning"
        ]
        if multi_agent_workflow_span:
            multi_agent_workflow_span_id = multi_agent_workflow_span[0]

    if workflow_spans:
        workflow_run_span_id = workflow_spans[0]
        workflow_start = spans["start_time"][workflow_run_span_id]
        workflow_end = spans["end_time"][workflow_run_span_id]
        total_time = workflow_end - workflow_start

        if user_query_agent_flow:
            workflow_input = spans["attributes.input.value"].get(
                multi_agent_workflow_span_id,
                "",
            )
            workflow_output = spans["attributes.output.value"].get(
                multi_agent_workflow_span_id,
                "",
            )
        else:
            workflow_input = spans["attributes.input.value"].get(
                workflow_run_span_id,
                "",
            )
            workflow_output = spans["attributes.output.value"].get(
                workflow_run_span_id,
                "",
            )

        workflow_input = _print_pretty_with_embedded_json(workflow_input)
        workflow_output = _print_pretty_with_embedded_json(workflow_output)

        item = {
            "id": str(len(extracted_data) + 1),
            "data": {
                "label": "Workflow Complete",
                "input": workflow_input,
                "output": workflow_output,
                "reasoning": [],
                "start_time": workflow_start,
                "end_time": workflow_end,
                "time": total_time,
            },
            "level": str(current_level),
            "status": "triggered",
        }
        extracted_data.append(item)
    return extracted_data


def _generate_edges(nodes):
    edges = []
    nodes_by_id = {node["id"]: node for node in nodes}
    nodes_by_label = {}

    # Group nodes by label
    for node in nodes:
        label = node["data"]["label"]
        nodes_by_label.setdefault(label, []).append(node["id"])

    # Find specific agent nodes
    command_routing_agent = nodes_by_label.get("Command Routing Agent", [])
    personalization_command = nodes_by_label.get("Tool: Personalization Command", [])
    search_with_sentiment = nodes_by_label.get("Tool: Search with Sentiment", [])
    search_agents = nodes_by_label.get("Tool: Search", [])
    planning_agents = nodes_by_label.get("Planning Agent", [])
    inventory_agents = nodes_by_label.get("Inventory Agent", [])
    personalization_agents = nodes_by_label.get("Product Personalization Agent", [])
    review_agents = nodes_by_label.get("Review Agent", [])
    evaluation_agents = nodes_by_label.get("Evaluation Agent", [])
    presentation_agents = nodes_by_label.get("Presentation Agent", [])
    workflow_complete = nodes_by_label.get("Workflow Complete", [])

    if command_routing_agent:
        command_id = command_routing_agent[0]
        for target_id in (
            search_with_sentiment + search_agents + personalization_command
        ):
            edges.append(
                {
                    "id": f"{command_id} - {target_id}",
                    "source": command_id,
                    "target": target_id,
                },
            )

    for source_id in search_with_sentiment + search_agents + personalization_command:
        if nodes_by_id[source_id]["status"] == "triggered":
            for planning_id in planning_agents:
                edges.append(
                    {
                        "id": f"{source_id} - {planning_id}",
                        "source": source_id,
                        "target": planning_id,
                    },
                )

    # 1. Connect Planning Agent to other agents
    if planning_agents:
        planning_id = planning_agents[0]
        for target_id in (
            inventory_agents[:1] + personalization_agents[:1] + review_agents[:1]
        ):
            edges.append(
                {
                    "id": f"{planning_id} - {target_id}",
                    "source": planning_id,
                    "target": target_id,
                },
            )

    # 2. Connect Review Agents and Evaluation Agents in sequence
    review_eval_sequence = []
    if review_agents and evaluation_agents:
        # Sort by ID to maintain sequence
        sorted_reviews = sorted(review_agents, key=int)
        sorted_evals = sorted(evaluation_agents, key=int)

        # Track which reviews have been connected
        connected_reviews = set()

        # First Review -> First Evaluation
        edges.append(
            {
                "id": f"{sorted_reviews[0]} - {sorted_evals[0]}",
                "source": sorted_reviews[0],
                "target": sorted_evals[0],
            },
        )
        connected_reviews.add(sorted_reviews[0])
        review_eval_sequence.append(sorted_reviews[0])
        review_eval_sequence.append(sorted_evals[0])

        # Handle Review-Eval-Review cycles
        for i in range(len(sorted_evals)):
            eval_id = sorted_evals[i]

            # Find the next review after this evaluation if any
            next_reviews = [r for r in sorted_reviews if int(r) > int(eval_id)]
            if next_reviews:
                next_review = next_reviews[0]
                edges.append(
                    {
                        "id": f"{eval_id} - {next_review}",
                        "source": eval_id,
                        "target": next_review,
                    },
                )
                connected_reviews.add(next_review)
                review_eval_sequence.append(next_review)

                # Connect this review to the next eval if any
                next_evals = [e for e in sorted_evals if int(e) > int(next_review)]
                if next_evals:
                    next_eval = next_evals[0]
                    edges.append(
                        {
                            "id": f"{next_review} - {next_eval}",
                            "source": next_review,
                            "target": next_eval,
                        },
                    )
                    review_eval_sequence.append(next_eval)

    # 3. Connect Review agents directly to Presentation if no Evaluation agent
    elif review_agents and presentation_agents:
        for review_id in review_agents:
            for present_id in presentation_agents:
                edges.append(
                    {
                        "id": f"{review_id} - {present_id}",
                        "source": review_id,
                        "target": present_id,
                    },
                )

    # 4. Connect Inventory and Product Personalization directly to Presentation
    for agent_id in inventory_agents + personalization_agents:
        for present_id in presentation_agents:
            edges.append(
                {
                    "id": f"{agent_id} - {present_id}",
                    "source": agent_id,
                    "target": present_id,
                },
            )

    # 5. Connect the last agent in the Review-Eval sequence to Presentation
    if review_eval_sequence and presentation_agents:
        last_agent = review_eval_sequence[-1]
        for present_id in presentation_agents:
            edges.append(
                {
                    "id": f"{last_agent} - {present_id}",
                    "source": last_agent,
                    "target": present_id,
                },
            )

    # 6. Connect Presentation to Workflow Complete
    for present_id in presentation_agents:
        for wf_id in workflow_complete:
            edges.append(
                {
                    "id": f"{present_id} - {wf_id}",
                    "source": present_id,
                    "target": wf_id,
                },
            )

    unique_edges = {edge["id"]: edge for edge in edges}.values()
    sorted_edges = sorted(
        unique_edges,
        key=lambda edge: (int(edge["source"]), int(edge["target"])),
    )
    return list(sorted_edges)


def _reorder_parallel_nodes(nodes: list[dict]) -> list[dict]:
    """
    Reorder in-place the visible nodes with labels:
    "Personalization Agent", "Review Agent", "Inventory Agent"
    to the order: Personalization Agent, Review Agent, Inventory Agent.
    Other nodes remain in their original relative order.
    """

    desired_order = ["Product Personalization Agent", "Review Agent", "Inventory Agent"]

    # Find indices of visible nodes with these labels
    label_to_index = {}
    for i, node in enumerate(nodes):
        label = node["data"].get("label")
        if label in desired_order and label not in label_to_index:
            label_to_index[label] = i

    # If any of the three nodes are missing, do nothing
    if not all(label in label_to_index for label in desired_order):
        return nodes

    # Get current indices
    idx_personalization = label_to_index["Product Personalization Agent"]
    idx_review = label_to_index["Review Agent"]
    idx_inventory = label_to_index["Inventory Agent"]

    # We want them in order: Personalization < Review < Inventory
    # Swap nodes pairwise to achieve this order

    # Helper to swap nodes at two indices
    def swap(i, j):
        nodes[i], nodes[j] = nodes[j], nodes[i]

    # Step 1: Ensure Personalization Agent is before Review Agent
    if idx_personalization > idx_review:
        swap(idx_personalization, idx_review)
        idx_personalization, idx_review = idx_review, idx_personalization

    # Step 2: Ensure Review Agent is before Inventory Agent
    if idx_review > idx_inventory:
        swap(idx_review, idx_inventory)
        idx_review, idx_inventory = idx_inventory, idx_review

    # Step 3: Re-check Personalization vs Review after step 2 swap
    if idx_personalization > idx_review:
        swap(idx_personalization, idx_review)

    return nodes


def _assign_level_to_agents(nodes):
    label_to_nodes = {}
    for n in nodes:
        label = (
            n["data"]["label"]
            if "data" in n and "label" in n["data"]
            else n.get("label")
        )
        if label not in label_to_nodes:
            label_to_nodes[label] = []
        label_to_nodes[label].append(n)

    # Assign levels
    level_map = {}  # node id -> level

    current_level = 1
    for n in label_to_nodes.get("Command Routing Agent", []):
        level_map[n["id"]] = current_level
        current_level += 1

    for label in [
        "Tool: Search with Sentiment",
        "Tool: Search",
        "Tool: Personalization Command",
    ]:
        for n in label_to_nodes.get(label, []):
            level_map[n["id"]] = current_level
            current_level += 1

    # Level 1: Planning Agent
    for n in label_to_nodes.get("Planning Agent", []):
        level_map[n["id"]] = current_level
        current_level += 1

    # Level 2: Inventory Agent, Product Personalization Agent, Review Agent
    for label in ["Inventory Agent", "Product Personalization Agent", "Review Agent"]:
        label_nodes = label_to_nodes.get(label, [])
        label_nodes = (
            [label_nodes[0]]  # Only assign this level to the first node.
            if label_nodes
            else []
        )
        for n in label_nodes:
            level_map[n["id"]] = current_level

    parallel_agents_level = current_level
    current_level += 1

    # Level 3+: All other visible nodes, in order of appearance, skipping already assigned
    already_assigned = set(level_map.keys())
    for n in nodes:
        if n["id"] in already_assigned:
            continue
        level_map[n["id"]] = current_level
        current_level += 1

    # Assign levels to nodes
    for node in nodes:
        if node["id"] in level_map:
            node["level"] = str(level_map[node["id"]])
    return nodes, current_level, parallel_agents_level


def extract_json_blocks(content: str) -> list[str]:
    """
    Extracts all top-level JSON-like blocks ({...} or [...]) from a string,
    including nested blocks.
    """
    blocks = []
    stack = []
    start_idx = None
    for idx, char in enumerate(content):
        if char in "{[":
            if not stack:
                start_idx = idx
            stack.append(char)
        elif char in "}]":
            if stack:
                open_char = stack.pop()
                # Check for matching pairs
                if (open_char == "{" and char != "}") or (
                    open_char == "[" and char != "]"
                ):
                    continue  # ignore mismatched
                if not stack and start_idx is not None:
                    blocks.append(content[start_idx : idx + 1])  # noqa: E203
                    start_idx = None
    return blocks


def _print_pretty_with_embedded_json(content: str) -> str:
    """
    Prettifies content for API response.

    1. If whole string is valid JSON -> json.dumps formatting.
    2. Else, pretty print all embedded `{...}` or `[...]` blocks.
    3. Safe for dict-like strings (LLM outputs, logs, traces).
    """
    # Case 1: Whole string is valid JSON
    try:
        parsed = json.loads(content)
        return json.dumps(parsed, indent=4, ensure_ascii=False)
    except (json.JSONDecodeError, TypeError):
        pass

    content = re.sub(r"\s+", " ", content)
    blocks = extract_json_blocks(content)

    for block in blocks:
        is_parsed = True
        pretty_block = re.sub(r"(\\n|\n)", "", block)
        pretty_block = re.sub(r"\\", "", pretty_block)

        try:
            pretty_block = json5.loads(pretty_block)
        except Exception:
            pretty_block, is_parsed = _parse_using_literal_eval(pretty_block)

        if is_parsed and isinstance(pretty_block, dict):
            for key, value in pretty_block.items():
                if isinstance(value, str):
                    pretty_block[key] = _print_pretty_with_embedded_json(value)
            pretty_block = json.dumps(pretty_block, indent=4, ensure_ascii=False)
        elif isinstance(pretty_block, str):
            pretty_block = _parse_json_using_regex(pretty_block)
        elif isinstance(pretty_block, list):
            pretty_block = json.dumps(pretty_block, indent=4, ensure_ascii=False)
        content = content.replace(block, "\n" + pretty_block + "\n")

    return content


def _parse_using_literal_eval(content: str) -> tuple[dict | str, bool]:
    """
    Parses a string using ast.literal_eval.
    Handles single quotes and unquoted keys.
    """
    is_parsed = True
    try:
        content = ast.literal_eval(content)
    except Exception:
        is_parsed = False

    return content, is_parsed


def _parse_json_using_regex(content: str) -> tuple[dict | str, bool]:
    """
    Parses a string using regex.
    Handles single quotes and unquoted keys.
    """
    # Case 1: Whole string is valid JSON
    try:
        parsed = json.loads(content)
        return json.dumps(parsed, indent=2, ensure_ascii=False)
    except (json.JSONDecodeError, TypeError):
        pass

    # Case 2: Format dict-like or list-like blocks
    blocks = re.findall(r"(\{.*?\}|\[.*?\])", content, re.DOTALL)

    for block in blocks:
        pretty_block = re.sub(r",\s*", ",\n", block)
        pretty_block = re.sub(r"([\{\[])\s*", r"\1\n", pretty_block)
        pretty_block = re.sub(r"\s*([\}\]])", r"\n\1", pretty_block)
        pretty_block = textwrap.indent(pretty_block, "   ")
        content = content.replace(block, pretty_block)
    return content


def format_variants(variants) -> list:
    formatted_variants = []
    for variant in variants:
        variant_data = {
            "price": f"${variant.price}",
            "in_stock": variant.in_stock,
        }
        for attribute in variant.attributes:
            variant_data[attribute.attribute_name] = attribute.attribute_value
        formatted_variants.append(variant_data)

    return formatted_variants


async def set_personalization_status(
    db: AsyncSession,
    user_id: int,
    product_id: int,
    status: StatusEnum,
) -> None:
    """Set the status of the personalized product section."""
    personalized_section = PersonalizedProductSection(
        product_id=product_id,
        user_id=user_id,
        status=status,
    )
    await PersonalizedProductRepository(db).add_or_update(personalized_section)
    logger.info(
        "Personalized product section status set to running for user_id=%s, product_id=%s",
        user_id,
        product_id,
    )


def convert_trace_id_to_hex(trace_id):
    """
    Convert the trace ID to a hexadecimal string as this is used to fetch the trace data.
    Args:
        trace_id (int): The trace ID to convert.
    Returns:
        str: The hexadecimal representation of the trace ID with 0x prefix removed.
    """

    hexed_tace_id = hex(int(trace_id))[2:]
    padded_trace_id = hexed_tace_id.zfill(32)

    return padded_trace_id
