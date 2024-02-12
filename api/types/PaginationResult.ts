type PaginationResult = {
  result?: {
    docs: object[];
    total: number;
    limit: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
    prevPage?: number;
  };
};

export default PaginationResult;
