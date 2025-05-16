export const PRODUCT_DETAIL_API = (id: number) => `api/v1/products/${id}`;
export const PRODUCT_LIST_API = (page: number, pageSize: number) =>
  `api/v1/products/?page_size=${pageSize}&page=${page}`;
export const PERSONALIZED_SECTION_API = (productId: number) => `api/v1/products/${productId}/personalizations`;
export const REVIEWS_API = (productId: number) => `api/v1/products/${productId}/reviews`;
export const PRODUCT_SEARCH_API = (searchString: string) => `api/v1/products/search?query=${searchString}`;
export const USERS_API = 'api/v1/users/';
export const SEARCH_API = 'api/v1/agents/query';
export const TASK_EVENTS_API = (userId: string | null) => `api/v1/chat/task-events/?user_id=${userId}`;
export const DEBUG_PANEL_API = (productId: number) => `api/v1/products/${productId}/debug`;
export const QUERY_FLOW_API = (traceId = '') => `api/v1/products/search/debug?trace_id=${traceId}`;
export const RESET_API = 'api/v1/reset';
