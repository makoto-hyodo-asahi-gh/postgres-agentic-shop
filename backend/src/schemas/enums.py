import enum


class AgentNames(enum.Enum):
    USER_QUERY_AGENT = "user_query_agent"
    PLANNING_AGENT = "planning_agent"
    PRODUCT_PERSONALIZATION_AGENT = "product_personalization_agent"
    REVIEWS_AGENT = "reviews_agent"
    EVALUATION_AGENT = "evaluation_agent"
    INVENTORY_AGENT = "inventory_agent"
    PRESENTATION_AGENT = "presentation_agent"


class UserQueryAgentAction(enum.Enum):
    PRODUCT_SEARCH = "product_search"
    PERSONALIZATION = "personalization"


class PersonalizedCardTypes(enum.Enum):
    LIST_CARD = "list_card"
    TEXT_CARD = "text_card"
    FEATURE_CARD = "feature_card"
    GRAPH_CARD = "graph_card"


class EventType(enum.Enum):
    PERSONALIZATION_WORKFLOW = "personalization_workflow"
    PRODUCT_SEARCH = "product_search"
    MEMORY = "memory"
    ERROR = "error"


class StatusEnum(enum.Enum):
    pending = "pending"
    running = "in-progress"
    done = "done"
    failed = "failed"
