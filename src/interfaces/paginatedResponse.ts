export default interface PaginatedResponse<T> {
  error: {};
  metadata: {
    pagination: PaginationNode;
  };
  data: T;
}

interface PaginationNode {
  page: number;
  pageResults: number;
  totalPages: number;
  totalResults: number;
}
